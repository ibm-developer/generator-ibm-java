/*
 * Copyright IBM Corporation 2017
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
var Handlebars = require('handlebars');
var config = require("../lib/config");
var processor = require("../lib/fsprocessor");
var control = require("../lib/control");
var helpers = require("../lib/helpers");
var fspath = require('path');
var logger = require("../lib/log");

//clone any property, only if it is already present in the target object
var clone = function(from, to) {
  for (var prop in to) {
    if (to.hasOwnProperty(prop)) {
        if(from[prop]) {
          to[prop] = from[prop];
        }
    }
  }
}

//questions to ask when running in interactive mode
var questions = [{
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
  }, {
    name : 'Microservice : a basic Java microservice with Cloudant',
    value : 'microservice',
    short : 'Basic Java microservice'
  }],
  default : 0 // Default to rest sample
}, {
  type    : 'list',
  name    : 'buildType',
  message : 'Select the build type for your project.\n',
  choices : ['maven', 'gradle'],
  default : 0 // Default to maven
}];

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    //create command line options that will be passed by YaaS
    this.option('buildType', {desc : 'Build system to use', type : String, default : 'maven'});
    this.option('createType', {desc : 'Type of application to generate', type : String, default : 'rest'});
    this.option('appName', {desc : 'Name of the application', type : String, default : 'myLibertyProject'});
    this.option('artifactId', {desc : 'Artifact ID to use for the build', type : String, default : 'myLibertyProject'});
    this.option('groupId', {desc : 'Name of the application', type : String, default : 'liberty.projects'});
    this.option('version', {desc : 'Version of the application', type : String, default : '1.0-SNAPSHOT'});
    this.option('headless', {desc : 'Run this generator headless i.e. driven by options only, no prompting', type : String, default : "false"});
    this.option('debug', {desc : 'Generate a log.txt file in the root of the project', type : String, default : "false"});
    logger.writeToLog("Options", this.options);
    logger.writeToLog("Config (default)", config.data);
    //overwrite any default values with those specified as options
    clone(this.options, config.data);
    //set values based on either defaults or passed in values
    config.data.templatePath = config.data.createType;
    config.data.templateFullPath = this.templatePath(config.data.templatePath);
    config.data.projectPath = fspath.resolve(this.destinationRoot(), "projects/" + config.data.createType);
    logger.writeToLog("Config", config.data);
  }

  prompting() {
    var promptWith = (config.data.headless === "true") ? [] : questions;
    return this.prompt(promptWith).then((answers) => {
      logger.writeToLog("Answers", answers);
      //configure the sample to use based on the type we are creating
      if(answers.createType) {
        config.data.templatePath = answers.createType;   //override with user selection
        config.data.templateFullPath = this.templatePath(config.data.templatePath);
        config.data.projectPath = fspath.resolve(this.destinationRoot(), "projects/" + answers.createType);
      }
      config.data.buildType = answers.buildType || config.data.buildType;
      config.data.bluemix = answers.bluemix || config.data.bluemix;
    });
  }

  writing() {
    logger.writeToLog('template path', config.data.templatePath);
    logger.writeToLog('project path', config.data.projectPath);
    if(!config.isValid()) {
      //the config object is not valid, so need to exit at this point
      this.log("Error : configuration is invalid, code generation is aborted");
      return;
    }
    control.processProject(config);
    this.destinationRoot(config.data.projectPath);
    logger.writeToLog("Destination path", this.destinationRoot());
    processor.path = this.templatePath(config.data.templatePath);
    logger.writeToLog("Processor", processor);
    return processor.scan((relativePath, template) => {
      if(!control.shouldGenerate(relativePath)) {
        return;   //do not include this file in the generation
      }
      var outFile = this.destinationPath(relativePath);
      logger.writeToLog("CB : writing to", outFile);
      try {
        var compiledTemplate = Handlebars.compile(template);
        var output = compiledTemplate(config.data);
        //var output = Handlebars.render(template, config.data);
        this.fs.write(outFile, output);
      } catch (err) {
        console.log("Error processing : " + relativePath);
        logger.writeToLog("Template error : " + relativePath, err);
      }
    });
  }

  end() {
    if(config.data.debug == "true") {
      var compiledTemplate = Handlebars.compile("{{#.}}\n{{{.}}}\n{{/.}}\n");
      var log = compiledTemplate(logger.getLogs);
      this.fs.write("log.txt", log);
    }
  }

};
