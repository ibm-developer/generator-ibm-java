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
var helpers = require("../lib/helpers");
var fspath = require('path');
var logger = require("../lib/log");
var fs = require('fs');
var Control = require('../lib/control');

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
    name : 'Basic : a basic Java microservice',
    value : 'basic',
    short : 'Basic Java microservice'
  }, {
    name : 'Microservice : a basic Java microservice with Cloudant',
    value : 'microservice',
    short : 'Basic Java microservice'
  }, {
    name : 'BFF : Backend For Frontend (generate java from Swagger/OpenAPI) (TBD)',
    value : 'bff',
    short : 'Backend For Frontend'
  }],
  default : 0 // Default to rest sample
}, {
  type    : 'list',
  name    : 'buildType',
  message : 'Select the build type for your project.\n',
  choices : ['maven', 'gradle'],
  default : 0 // Default to maven
}, {
  type    : 'checkbox',
  name    : 'services',
  message : 'Select the services for your project.\n',
  choices : ['none','cloudant'],
  default : 0 // Default to none
}, {
  type    : 'input',
  name    : 'appName',
  message : 'Enter a name for your project',
  default : "myProject"
}];

var toObject = function(value) {
  if(typeof value == 'string') {
    return JSON.parse(value);
  }
  if(typeof value === 'object') {
    return value;
  }
  return value;
}

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    //create command line options that will be passed by YaaS
    this.option('buildType', {desc : 'Build system to use', type : String, default : 'maven'});
    this.option('createType', {desc : 'Type of application to generate', type : String, default : 'basic'});
    this.option('appName', {desc : 'Name of the application', type : String, default : 'LibertyProject'});
    this.option('artifactId', {desc : 'Artifact ID to use for the build', type : String, default : 'demo'});
    this.option('groupId', {desc : 'Name of the application', type : String, default : 'liberty.projects'});
    this.option('version', {desc : 'Version of the application', type : String, default : '1.0-SNAPSHOT'});
    this.option('headless', {desc : 'Run this generator headless i.e. driven by options only, no prompting', type : String, default : "false"});
    this.option('debug', {desc : 'Generate a log.txt file in the root of the project', type : String, default : "false"});
    this.option('bluemix', {desc : 'Bluemix options', type : (value)=>{return toObject(value);}, default : undefined});
    this.option('input', {desc : 'Input data file', type : processor.getContentsSync, default : undefined});
    logger.writeToLog("Options", this.options);
    logger.writeToLog("Config (default)", config.data);
    //overwrite any default values with those specified as options
    clone(this.options, config.data);
    //set values based on either defaults or passed in values
    config.data.templateName = config.data.createType;
    config.data.templateRoot = this.templatePath();
    this._setProjectPath();
    logger.writeToLog("Config", config.data);
  }

  _setProjectPath() {
    //headless assumes that the output will be handled by the calling process / service
    if(config.data.headless === "true") {
      config.data.projectPath = fspath.resolve(this.destinationRoot());
    } else {
      config.data.projectPath = fspath.resolve(this.destinationRoot(), "projects/" + config.data.appName);
    }
  }

  prompting() {
    var promptWith = (config.data.headless === "true") ? [] : questions;
    return this.prompt(promptWith).then((answers) => {
      logger.writeToLog("Answers", answers);
      //configure the sample to use based on the type we are creating
      if(answers.createType) {
        config.data.createType = answers.createType;
        config.data.templateName = answers.createType;   //override with user selection
      }
      config.data.buildType = answers.buildType || config.data.buildType;
      config.data.bluemix = answers.bluemix || config.data.bluemix;
      if(config.data.bluemix) {
        config.data.appName = config.data.bluemix.name || answers.appName || config.data.appName;
      } else {
        config.data.appName = answers.appName || config.data.appName;
      }
      //below this point, the only way to get these answers is to run the generator locally
      if(answers.services) {
        if(!config.data.bluemix) {
          config.data.bluemix = {};
        }
        logger.writeToLog("Processing interactive answers", answers.services);
        for(var i = 0; i < answers.services.length; i++) {
          var service = answers.services[i];
          if(service === "none") {
            config.data.bluemix = undefined;
            break;    //stop processing if none has been selected
          }
          if(service === "cloudant") {
            if(!config.data.bluemix.cloudant) {
              config.data.bluemix.cloudant = [
                {
                  "password": "pass",
                  "url": "https://account.cloudant.com",
                  "username": "user"
                }
              ];
            }
          }
        }
      }
      this._setProjectPath();
      logger.writeToLog("Config (after answers)", config.data);
    });
  }

  writing() {
    logger.writeToLog('template path', config.data.templateName);
    logger.writeToLog('project path', config.data.projectPath);
    if(!config.isValid()) {
      //the config object is not valid, so need to exit at this point
      this.log("Error : configuration is invalid, code generation is aborted");
      throw "Invalid configuration";
    }
    this.destinationRoot(config.data.projectPath);
    logger.writeToLog("Destination path", this.destinationRoot());
    var control = new Control(fspath.resolve(config.data.templateRoot, config.data.templateName), config);
    processor.paths = control.getComposition();
    logger.writeToLog("Processor", processor);
    return processor.scan((relativePath, template) => {
      var outFile = this.destinationPath(relativePath);
      logger.writeToLog("CB : writing to", outFile);
      try {
        var compiledTemplate = Handlebars.compile(template);
        var output = compiledTemplate(config.data);
        this.fs.write(outFile, output);
      } catch (err) {
        logger.writeToLog("Template error : " + relativePath, err.message);
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
