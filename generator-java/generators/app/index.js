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

const Generator = require('yeoman-generator');
const fspath = require('path');
const fs = require('fs');
const extend = require('extend');

const PromptMgr = require('../lib/promptmgr');
const defaults = require('../lib/defaults');

const common = require('@arf/java-common');
const Config = common.config;
const processor = common.fsprocessor;
const Context = common.context;
const Control = common.control;
const logger = common.log;
const Handlebars = require('../lib/helpers').handlebars;

var config = undefined;
var promptmgr = undefined;
var contexts = [];
var patterns = ['basic', 'microservice', 'basicweb', 'bff', 'picnmix'];

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
    config = new Config(defaults);
    promptmgr = new PromptMgr(config);
    var pkg = require('../../package.json');
    config.genVersions = {'generator-java': pkg.version,
      'generator-liberty': pkg.dependencies['@arf/generator-liberty'],
      'java-common':pkg.dependencies['@arf/java-common']};
    promptmgr.add('patterns');
    promptmgr.add('bluemix');
    logger.writeToLog("Config (default)", config);
    //overwrite any default values with those specified as options
    config.apply(this.options);
    logger.writeToLog("Config (after clone)", config);
    logger.writeToLog("Config", config);

    //set values based on either defaults or passed in values
    if (config.bluemix) {
      config.appName = config.bluemix.name || config.appName;
    }
    config.templateRoot = this.templatePath();
    config.projectPath = fspath.resolve(this.destinationRoot());
    this._addContext('@arf/generator-liberty');
  }

  _addContext(name) {
    var context = new Context(name, config, promptmgr);   //use the name for the context ID
    this.options.context = context;
    var location = fspath.parse(require.resolve(name));   //compose with the default generator
    this.composeWith(fspath.join(location.dir, 'generators', 'app'), this.options);
    contexts.push(context);
    this.options.context = undefined;
    return context;
  }

  prompting() {
    if(config.headless !== "true") {
      return this.prompt(promptmgr.getQuestions()).then((answers) => {
        logger.writeToLog("Answers", answers);
        promptmgr.afterPrompt(answers, config);
        logger.writeToLog("Config (after answers)", config);
        config.projectPath = fspath.resolve(this.destinationRoot(), "projects/" + config.appName);
        contexts.forEach(context => {
          context.conf.projectPath = config.projectPath;
        });
      });
    }
  }

  configuring() {
    //configure this generator and then pass that down through the contexts
    this.destinationRoot(config.projectPath);
    var control = new Control(fspath.resolve(config.templateRoot, config.createType), config);
    logger.writeToLog("Processor", processor);
    this.paths = control.getComposition();
    config.processProject(this.paths);
    contexts.forEach(context => {
      context.addDependencies(config.dependencies);
      context.addFrameworkDependencies(config.frameworkDependencies);
      if(config.envEntries) {
        context.addEnvEntries(config.envEntries);
      }
      if(config.jndiEntries) {
        context.addJNDIEntries(config.jndiEntries);
      }
      context.addCompositions(control.getSubComposition(context.id));
    });
    logger.writeToLog("Destination path", this.destinationRoot());
  }

  _isValidPattern() {
    var patternFound = patterns.includes(config.createType);
    if(!patternFound) {
      for(var i = 0; i < contexts.length && !patternFound;) {
        for(var j = 0; j < contexts[i].patterns.length && !patternFound;) {
          patternFound = (contexts[i].patterns[j] === config.createType);
        }
      }
    }
    return patternFound;
  }

  writing() {
    logger.writeToLog('template path', config.createType);
    logger.writeToLog('project path', config.projectPath);

    if(!this._isValidPattern()) {
      //the config object is not valid, so need to exit at this point
      this.log("Error : not a recognised pattern");
      throw "Invalid pattern " + config.createType;
    }
    if(!config.isValid()) {
      //the config object is not valid, so need to exit at this point
      this.log("Error : configuration is invalid, code generation is aborted");
      throw "Invalid configuration";
    }
    if(!patterns.includes(config.createType)) {
      return;   //not being written by us
    }

    logger.writeToLog("Processor", processor);
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
    }, this.paths);
  }

  end() {
    if(config.debug == "true") {
      var compiledTemplate = Handlebars.compile("{{#.}}\n{{{.}}}\n{{/.}}\n");
      var log = compiledTemplate(logger.getLogs);
      this.fs.write("log.txt", log);
    }
  }

};
