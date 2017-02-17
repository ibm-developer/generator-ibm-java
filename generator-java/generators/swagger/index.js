/*
 * Copyright IBM Corporation 2016
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


//template generation from a swagger document
var Generator = require('yeoman-generator');
var Handlebars = require('handlebars');
var config = require("../lib/config");
var processor = require("../lib/fsprocessor");
var control = require("../lib/control");
var fspath = require('path');
var fs = require('fs');
var javarules = require('../lib/javarules');

//clone any property, only if it is already present in the target object
var clone = function(from, to) {
  for (var prop in to) {
    if (to.hasOwnProperty(prop)) {
        to[prop] = from[prop];
    }
  }
}

//convert a swagger data type to a valid Java one
Handlebars.registerHelper('javaDataType', javarules.dataType);

//convert a swagger name to a valid Java class name
Handlebars.registerHelper('javaClassName', javarules.className);

//convert a swagger name to a valid Java method name
Handlebars.registerHelper('javaMethodName', javarules.methodName);

//lookup and resolve references to data types, will return the Java class name
Handlebars.registerHelper('refLookup', function(ref) {
  var parts = ref.split("/");
  return javarules.className(parts[parts.length - 1]);
});

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    //create command line options that will be passed by YaaS
    this.option('buildType', {desc : 'Build system to use', type : String, default : 'maven'});
    this.option('createType', {desc : 'Type of application to generate', type : String, default : 'swagger'});
    this.option('appName', {desc : 'Name of the application', type : String, default : 'myLibertyProject'});
    this.option('artifactId', {desc : 'Artifact ID to use for the build', type : String, default : 'myLibertyProject'});
    this.option('groupId', {desc : 'Name of the application', type : String, default : 'liberty.projects'});
    this.option('version', {desc : 'Version of the application', type : String, default : '1.0-SNAPSHOT'});
    this.option('headless', {desc : 'Run this generator headless i.e. driven by options only, no prompting', type : Boolean, default : false});
  }

  initializing() {
    //overwrite any default values with those specified as options
    clone(this.options, config.data);
    //set values based on either defaults or passed in values
    config.data.templatePath = 'cnds-java-starter-' + config.data.createType;
    config.data.templateFullPath = this.templatePath(config.data.templatePath);
    config.data.projectPath = fspath.resolve(this.destinationRoot(), "projects/" + config.data.createType);
    //console.log(JSON.stringify(config.data));
  }

  prompting() {
    if(config.data.headless) {
      control.processProject(config);
      console.log("Generator running headless : creating " + config.data.createType);
      return this.prompt([]);   //running headless, so no prompt
    }
    return this.prompt([{
      type    : 'list',
      name    : 'inputType',
      message : 'This is a test front end for manually driving the Java code generator.\n',
      choices : [{
        name : 'JSON : create from a swagger.json',
        value : 'json',
        short : 'Application from swagger.json'
      }, {
        name : 'YAML: create from a swagger.yaml (TBD)',
        value : 'yaml',
        short : 'Application from swagger.json'
      }],
      default : 0 // Default to generation from swagger.json
    }, {
      type    : 'inputPath',
      name    : 'filePath',
      message : 'Enter the path to you swagger definition file.\n'
    }, {
      type    : 'list',
      name    : 'buildType',
      message : 'Select the build type for your project.\n',
      choices : ['maven', 'gradle'],
      default : 0 // Default to maven
    }]).then((answers) => {
      //configure the sample to use based on the type we are creating
      config.data.buildType = answers.buildType;
      config.data.swaggerDef = answers.filePath;
      control.processProject(config);
    });
  }

  writing() {
    console.log('template path [' + config.data.templatePath  +']');
    console.log('project path [' + config.data.projectPath  +']');
    if(!config.isValid()) {
      //the config object is not valid, so need to exit at this point
      this.log("Error : configuration is invalid, code generation is aborted");
      return;
    }
    return new Promise((resolve, reject) => {
      var file = fspath.resolve(config.data.swaggerDef);
      if(!fs.existsSync(file)) {
        reject("Error : specified file does not exist " + file);
      }
      var stats = fs.statSync(file);
      if(stats.isDirectory()) {
        reject("Error : specified path is a directory");
      }
      //get this far then the file exists and is not a directory
      fs.readFile(file, 'utf8', (err, data) => {
        if(err) {
          reject(err);
        } else {
          config.data.swagger = JSON.parse(data);   //attach the swagger document to the config data
          console.log("Config : " + JSON.stringify(config.data.swagger.basePath));
          this.destinationRoot(config.data.projectPath);
          //this.log("Destination path : " + this.destinationRoot());
          processor.path = this.templatePath(config.data.templatePath);
          //console.log(JSON.stringify(processor));
          processor.scan((relativePath, template, config) => {
            if(!control.shouldGenerate(relativePath)) {
              return;   //do not include this file in the generation
            }
            var outFile = this.destinationPath(relativePath);
            //console.log("CB : writing to " + outFile);
            try {
              var compiledTemplate = Handlebars.compile(template);
              var output = compiledTemplate(config.data);
              //var output = Handlebars.render(template, config.data);
              this.fs.write(outFile, output);
            } catch (err) {
              console.log("Error processing : " + relativePath);
              reject(err);
            }
          }).then(function() {
            console.log("Finished scanning");
            resolve();
          });
        }
      });
    });
  }

};
