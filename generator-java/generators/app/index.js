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

'use strict'

const Generator = require('yeoman-generator')
const fspath = require('path')
const fs = require('fs')
const extend = require('extend')
const yml = require('js-yaml')

const Defaults = require('../lib/defaults')
const EnablementContext = require('../lib/enablementContext')

const common = require('ibm-java-codegen-common')
const Config = common.config
const processor = common.fsprocessor
const Context = common.context
const Control = common.control
const logger = common.log
const Handlebars = require('../lib/helpers').handlebars

let config = undefined
let contexts = []
let enablementContexts = []
const defaults = new Defaults()
const logId = require('../../package.json').name;

module.exports = class extends Generator {

  constructor (args, opts) {
    super(args, opts)

    //create command line options that will be passed by YaaS
    defaults.setOptions(this)
    logger.writeToLog(`${logId}:constructor - Options`, JSON.stringify(this.options))
    contexts = []
    enablementContexts = []
    this.enablementContext = new EnablementContext(contexts)
  }

  initializing () {
    config = new Config(defaults)
    //overwrite any default values with those specified as options
    config.overwrite(this.options)
    //set values based on either defaults or passed in values
    if (config.bluemix) {
      config.appName = config.bluemix.name || config.appName
      logger.writeToLog(`${logId}:initializing - Set config.appName to`, config.appName)
      if (config.bluemix.backendPlatform) {
        switch (config.bluemix.backendPlatform) {
          case 'SPRING':
            config.frameworkType = 'spring'
            logger.writeToLog(`${logId}:initializing - Set config.frameworkType to`, config.frameworkType)
            break
          case 'JAVA':
            config.frameworkType = 'liberty'
            logger.writeToLog(`${logId}:initializing - Set config.frameworkType to`, config.frameworkType)
            break
          default:
            throw new Error('Backend platform ' + config.bluemix.backendPlatform + ' is not supported by this generator.')
        }
      }
    }
    if (!config.artifactId) {
      config.artifactId = config.appName
      logger.writeToLog(`${logId}:initializing - Set config.artifactId to`, config.artifactId)
    }

    config.templateRoot = this.templatePath()
    logger.writeToLog(`${logId}:initializing - Set config.templateRoot to`, config.templateRoot)
    config.projectPath = fspath.resolve(this.destinationRoot())
    logger.writeToLog(`${logId}:initializing - Set config.projectPath to`, config.projectPath)
    this._addContext('generator-ibm-java-liberty')
    this._addContext('generator-ibm-java-spring')
    this._addEnablementContext()
    this.recognisedPattern = fs.existsSync(this.templatePath(config.createType))
  }

  //these generators need to be composed in this order cloud -> service -> use case
  _addEnablementContext () {
    //configure and setup the cloud enablement generator
    this.cloudGeneratorConfig = extend(new Config(), config)
    this.options.cloudContext = this.cloudGeneratorConfig
    this.composeWith(require.resolve('generator-ibm-cloud-enablement'), this.options)
    enablementContexts.push(this.cloudGeneratorConfig)

    //configure and setup the service enablement generator
    this.options.bluemix = JSON.stringify(this.options.bluemix)
    this.options.parentContext = this.enablementContext
    this.composeWith(require.resolve('generator-ibm-service-enablement'), this.options)
    enablementContexts.push(this.enablementContext)

    //configure and setup the use case enablement generator if this is a starter kit
    if (config.createType.startsWith('skit/')) {
      this.usecaseGeneratorConfig = extend(new Config(), config)
      this.options.parentContext = this.enablementContext
      this.options.parentContext.usecaseContext = this.usecaseGeneratorConfig
      this.composeWith(require.resolve('generator-ibm-usecase-enablement'), this.options)
      enablementContexts.push(this.usecaseGeneratorConfig)
    }
  }

  _addContext (name) {
    const context = new Context(name, config)   //use the name for the context ID
    this.options.context = context
    const location = fspath.parse(require.resolve(name))   //compose with the default generator
    this.composeWith(fspath.join(location.dir, 'generators', 'app'), this.options)
    contexts.push(context)
    this.options.context = undefined
    return context
  }

  prompting () {
    //this generator does not prompt, questions can be set in the prompts directory for testing purposes
  }

  //loads a resource from the resources folder, passing it through handlebars
  _loadresource(pathInResourcesFolder) {
    let fullpath = fspath.join('../../resources', pathInResourcesFolder);
    let template = fs.readFileSync(this.templatePath(fullpath), 'utf8');
    let compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(config);
  }
  
  configuring () {
    const pkg = require('../../package.json')
    const parts = config.createType.split('/') //framework is defined by the value of createType which is <pattern>/<framework> and overrides any previous value
    config.frameworkType = (parts.length == 2) ? parts[1] : config.frameworkType

    config.genVersions = {
      'generator-ibm-java': pkg.version,
      'ibm-java-codegen-common': pkg.dependencies['ibm-java-codegen-common'],
      'generator-ibm-service-enablement': pkg.dependencies['generator-ibm-service-enablement'],
      'generator-ibm-cloud-enablement': pkg.dependencies['generator-ibm-cloud-enablement']
    }
    config.genVersions['generator-ibm-java-' + config.frameworkType] = pkg.dependencies['generator-ibm-java-' + config.frameworkType]
    if (config.frameworkType === 'liberty' && config.createType === 'bff/liberty') {
      config.enableApiDiscovery = true
    }
    if (config.frameworkType === 'spring' && config.createType === 'bff/spring') {
      const resource = this._loadresource('bff/swagger.yaml');
      const bffSwagger = JSON.stringify(yml.safeLoad(resource));
      if (config.bluemix) {
        if (config.bluemix.openApiServers) {
          config.bluemix.openApiServers.push({'spec': bffSwagger})
        } else {
          config.bluemix.openApiServers = [{'spec': bffSwagger}]
        }
      } else {
        config.bluemix = {
          openApiServers: [
            {
              'spec': bffSwagger
            }
          ]
        }
      }
    }
    //configure this generator and then pass that down through the contexts
    const control = new Control(fspath.resolve(config.templateRoot, config.createType), config)
    this.paths = control.getComposition()
    config.processProject(this.paths)
    contexts.forEach(context => {
      context.conf.genVersions = config.genVersions
      context.conf.addProperties(config.properties)
      context.conf.addDependencies(config.dependencies)
      context.conf.addFrameworkDependencies(config.frameworkDependencies)
      if (config.envEntries) {
        context.conf.addEnvEntries(config.envEntries)
      }
      if (config.jndiEntries) {
        context.conf.addJndiEntries(config.jndiEntries)
      }
      context.addCompositions(control.getSubComposition(context.id))
      context.conf.enableApiDiscovery = config.enableApiDiscovery
    })
    enablementContexts.forEach(context => {
      context.appName = config.appName
    })
  }

  _isValidPattern () {
    let patternFound = this.recognisedPattern
    if (!patternFound) {
      for (let i = 0; i < contexts.length && !patternFound; i++) {
        for (let j = 0; j < contexts[i].patterns.length && !patternFound; j++) {
          patternFound = (contexts[i].patterns[j] === config.createType)
        }
      }
    }
    return patternFound
  }

  writing () {
    logger.writeToLog(`${logId}:writing - config.createType`, config.createType)
    logger.writeToLog(`${logId}:writing - config.projectPath`, config.projectPath)

    if (!this._isValidPattern()) {
      //the config object is not valid, so need to exit at this point
      logger.writeToLog(`${logId}:writing - Error : not a recognised pattern`)
      throw new Error('Invalid pattern ' + config.createType)
    }
    if (!config.isValid()) {
      //the config object is not valid, so need to exit at this point
      logger.writeToLog(`${logId}:writing - Error : configuration is invalid, code generation is aborted`)
      throw new Error('Invalid configuration')
    }
    if (!this.recognisedPattern) {
      return   //not being written by us
    }

    return processor.scan(config, (relativePath, template) => {
      const outFile = this.destinationPath(relativePath)
      logger.writeToLog(`${logId}:writing - Writing file`, outFile)
      try {
        const compiledTemplate = Handlebars.compile(template)
        const output = compiledTemplate(config)
        this.fs.write(outFile, output)
      } catch (err) {
        logger.writeToLog(`${logId}: writing - Template error : ${relativePath}`, err.message)
      }
    }, this.paths)
  }

  end () {}

}
