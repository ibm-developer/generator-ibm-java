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
const Defaults = require('../lib/defaults');
const EnablementContext = require('../lib/enablementContext');

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
var enablementContexts = [];
var patterns = ['microservice/liberty', 'microservice/spring', 'basicweb/liberty', 'basicweb/spring', 'bff', 'picnmix', 'enable/liberty', 'enable/spring'];
var defaults = new Defaults();

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    //create command line options that will be passed by YaaS
    defaults.setOptions(this);
    logger.writeToLog("Options", this.options);
    this.enablementContext = new EnablementContext(contexts);

  }

  initializing() {
    config = new Config(defaults);
    promptmgr = new PromptMgr(config);
    promptmgr.add('patterns');
    promptmgr.add('bluemix');
    logger.writeToLog("Config (default)", config);
    //overwrite any default values with those specified as options
    config.overwrite(this.options);
    logger.writeToLog("Config (after clone)", config);

    //set values based on either defaults or passed in values
    if ( config.bluemix ) {
      config.appName = config.bluemix.name || config.appName;

      if(config.bluemix.backendPlatform) {
        switch (config.bluemix.backendPlatform) {
          case 'SPRING':
            config.frameworkType = 'spring';
            break;
          case 'JAVA': 
            config.frameworkType = 'liberty';
            break;
          default:
            throw new Error('Backend platform ' + config.bluemix.backendPlatform + ' is not supported by this generator.');
        }
      }
    }

    config.templateRoot = this.templatePath();
    config.projectPath = fspath.resolve(this.destinationRoot());
    logger.writeToLog("Config (final)", config);
    this._addContext('@arf/generator-liberty');
    this._addContext('@arf/generator-spring');
    this._addEnablementContext()
  }

  _addEnablementContext() {
    this.cloudGeneratorConfig = extend(new Config(), config);
    this.options.cloudContext = this.cloudGeneratorConfig;
    this.composeWith(require.resolve("generator-ibm-cloud-enablement"), this.options);
    enablementContexts.push(this.cloudGeneratorConfig);
    
    this.options.bluemix = JSON.stringify(this.options.bluemix);
    this.options.parentContext = this.enablementContext;
    this.composeWith(require.resolve("generator-ibm-service-enablement"), this.options);
    enablementContexts.push(this.enablementContext);
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
        enablementContexts.forEach(context => {
          if(context.bluemix) {
            Object.assign(context.bluemix, config.bluemix);
          } else {
            context.bluemix = config.bluemix;
          }
          context.createType = config.createType;
        });
      });
    }
  }

  configuring() {
    var pkg = require('../../package.json');
    var parts = config.createType.split('/'); //framework is defined by the value of createType which is <pattern>/<framework> and overrides any previous value
    config.frameworkType = (parts.length == 2) ? parts[1] : config.frameworkType;

    config.genVersions = {'generator-java': pkg.version,
      'java-common':pkg.dependencies['@arf/java-common'],
      'generator-ibm-service-enablement' : pkg.dependencies['generator-ibm-service-enablement'],
      'generator-ibm-cloud-enablement' : pkg.dependencies['generator-ibm-cloud-enablement']};
    config.genVersions['generator-' + config.frameworkType] = pkg.dependencies['@arf/generator-' + config.frameworkType];
    if(config.frameworkType === 'liberty' && config.createType === 'basicweb') {
      config.healthEndpoint = 'rest/health';
    } else {
      config.healthEndpoint = 'health';
    }
    //configure this generator and then pass that down through the contexts
    this.destinationRoot(config.projectPath);
    var control = new Control(fspath.resolve(config.templateRoot, config.createType), config);
    logger.writeToLog("Processor", processor);
    this.paths = control.getComposition();
    config.processProject(this.paths);
    contexts.forEach(context => {
      context.conf.genVersions = config.genVersions;
      context.conf.addProperties(config.properties);
      context.conf.addDependencies(config.dependencies);
      context.conf.addFrameworkDependencies(config.frameworkDependencies);
      if(config.envEntries) {
        context.conf.addEnvEntries(config.envEntries);
      }
      if(config.jndiEntries) {
        context.conf.addJndiEntries(config.jndiEntries);
      }
      context.addCompositions(control.getSubComposition(context.id));
    });
    enablementContexts.forEach(context => {
      context.appName = config.appName;
      context.healthEndpoint = config.healthEndpoint;
    });
    logger.writeToLog("Destination path", this.destinationRoot());
  }

  _isValidPattern() {
    var patternFound = patterns.includes(config.createType);
    if(!patternFound) {
      for(var i = 0; i < contexts.length && !patternFound; i++) {
        for(var j = 0; j < contexts[i].patterns.length && !patternFound; j++) {
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
