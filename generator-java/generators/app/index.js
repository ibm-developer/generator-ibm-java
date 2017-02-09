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

var Generator = require('yeoman-generator');
var Mustache = require('mustache');
var config = require("./lib/config");
var processor = require("./lib/fsprocessor");
var control = require("./lib/control");
var fspath = require('path');

//clone any property, only if it is already present in the target object
var clone = function(from, to) {
  for (var prop in to) {
    if (to.hasOwnProperty(prop)) {
        to[prop] = new String(from[prop]);
    }
  }
}

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    //create command line options that will be passed by YaaS
    this.option('buildType', {desc : 'Build system to use', type : String, default : 'maven'});
    this.option('createType', {desc : 'Type of application to generate', type : String, default : 'rest'});
    this.option('name', {desc : 'Name of the application', type : String, default : 'myLibertyProject'});
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
      name    : 'createType',
      message : 'This is a test front end for manually driving the Java code generator.\n',
      choices : [{
        name : 'REST : a basic REST sample used to test this generator',
        value : 'rest',
        short : 'REST sample application'
      }, {
        name : 'Basic : a basic Java microservice (TBD)',
        value : 'basic',
        short : 'Basic Java microservice'
      }],
      default : 0 // Default to rest sample
    }, {
      type    : 'list',
      name    : 'buildType',
      message : 'Select the build type for your project.\n',
      choices : ['maven', 'gradle'],
      default : 0 // Default to maven
    }]).then((answers) => {
      //configure the sample to use based on the type we are creating
      config.data.templatePath = 'cnds-java-starter-' + answers.createType;   //override with user selection
      config.data.templateFullPath = this.templatePath(config.data.templatePath);
      config.data.projectPath = fspath.resolve(this.destinationRoot(), "projects/" + answers.createType);
      config.data.buildType = answers.buildType;
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
    this.destinationRoot(config.data.projectPath);
    //this.log("Destination path : " + this.destinationRoot());
    processor.path = this.templatePath(config.data.templatePath);
    //console.log(JSON.stringify(processor));
    return processor.scan((relativePath, template) => {
      if(!control.shouldGenerate(relativePath)) {
        return;   //do not include this file in the generation
      }
      var outFile = this.destinationPath(relativePath);
      //console.log("CB : writing to " + outFile);
      var output = Mustache.render(template, config.data);
      this.fs.write(outFile, output);
    });
  }

};
