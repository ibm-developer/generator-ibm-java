/*
 * © Copyright IBM Corp. 2017, 2018
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

'use strict';

const Generator = require('yeoman-generator');
const extend = require('extend');
const Defaults = require('./lib/defaults');
const OpenApi = require('./lib/openapi');

const defaults = new Defaults();
const logId = require('../../package.json').name;

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    if(!opts.context) throw "This generator cannot be run standalone, only composed with.";
    defaults.setOptions(this);
    extend(this, opts.context);   //inject the objects and functions directly into 'this' to make things easy
    this.logger.writeToLog(`${logId}:constructor - context`, opts.context);
    this.conf.addMissing(opts, defaults);
    this.openApiDir = [];
    this.logger.writeToLog(`${logId}:constructor -  conf (final)`, this.conf);
  }

  initializing() {
  }

  prompting() {
    //this generator does not prompt, questions can be set in the prompts directory for testing purposes
  }

  configuring() {
    this.configure(this);
    if(this.conf.bluemix && this.conf.bluemix.openApiServers && this.conf.bluemix.backendPlatform == 'SPRING') {
      return OpenApi.generate(this.conf.bluemix.openApiServers, this.logger)
        .then(dir => {
          this.openApiDir = dir
        });
    }
  }

  writing() {
    if(this.openApiDir.length > 0) {
      OpenApi.writeFiles(this.openApiDir, this)
      const homeControllerPath = this.destinationPath('src/main/java/io/swagger/configuration/HomeController.java')
      if (this.fs.exists(homeControllerPath)) {
        this.fs.delete(homeControllerPath)
      }
      if(!(this.conf.createType == 'blank/spring')) {
        const springBootApplicationPath = this.destinationPath('src/main/java/io/swagger/Swagger2SpringBoot.java')
        if (this.fs.exists(springBootApplicationPath)) {
          this.fs.delete(springBootApplicationPath)
        }
      }
    }
    return this.defaultWriter(this);   //use the default writer supplied by the context.
  }

  end() {
  }

};