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
var Config = require("../lib/config");
var processor = require("../lib/fsprocessor");
var helpers = require("../lib/helpers");
var fspath = require('path');
var logger = require("../lib/log");
var fs = require('fs');
var Control = require('../lib/control');
var PromptMgr = require('../lib/promptmgr');
var defaults = require('../lib/defaults');

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

var config = new Config();
var promptmgr = undefined;

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    //create command line options that will be passed by YaaS
    var defaultValues = defaults.get();
    for(var i = 0; i < defaultValues.length; i++) {
      var defaultValue = defaultValues[i];
      this.option(defaultValue, defaults.getObject(defaultValue));
    }
    logger.writeToLog("Options", this.options);
  }

  initializing() {
    config = new Config();
    promptmgr = new PromptMgr(config);

    promptmgr.add('common');
    promptmgr.add('liberty');
    promptmgr.add('patterns');
    promptmgr.add('bluemix');
    logger.writeToLog("Config (default)", config);
    //overwrite any default values with those specified as options
    clone(this.options, config);
    //set values based on either defaults or passed in values
    config.templateName = config.createType;
    config.templateRoot = this.templatePath();
    this._setProjectPath();
    logger.writeToLog("Config", config);
  }

  _setProjectPath() {
    //headless assumes that the output will be handled by the calling process / service
    if(config.headless === "true") {
      config.projectPath = fspath.resolve(this.destinationRoot());
    } else {
      config.projectPath = fspath.resolve(this.destinationRoot(), "projects/" + config.appName);
    }
  }

  prompting() {
    var promptWith = (config.headless === "true") ? [] : promptmgr.getQuestions();
    return this.prompt(promptWith).then((answers) => {
      logger.writeToLog("Answers", answers);
      promptmgr.afterPrompt(answers, config);
      this._setProjectPath();
      logger.writeToLog("Config (after answers)", config);
    });
  }

  writing() {
    logger.writeToLog('template path', config.templateName);
    logger.writeToLog('project path', config.projectPath);
    if(!config.isValid()) {
      //the config object is not valid, so need to exit at this point
      this.log("Error : configuration is invalid, code generation is aborted");
      throw "Invalid configuration";
    }
    this.destinationRoot(config.projectPath);
    logger.writeToLog("Destination path", this.destinationRoot());
    var control = new Control(fspath.resolve(config.templateRoot, config.templateName), config);
    processor.paths = control.getComposition();
    logger.writeToLog("Processor", processor);
    config.processProject(processor.paths);
    return processor.scan(config, (relativePath, template) => {
      var outFile = this.destinationPath(relativePath);
      logger.writeToLog("CB : writing to", outFile);
      try {
        var compiledTemplate = Handlebars.compile(template);
        var output = compiledTemplate(config);
        this.fs.write(outFile, output);
      } catch (err) {
        logger.writeToLog("Template error : " + relativePath, err.message);
      }
    });
  }

  end() {
    if(config.debug == "true") {
      var compiledTemplate = Handlebars.compile("{{#.}}\n{{{.}}}\n{{/.}}\n");
      var log = compiledTemplate(logger.getLogs);
      this.fs.write("log.txt", log);
    }
  }

};
