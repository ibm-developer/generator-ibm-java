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

// The context object to be passed to sub generators
const fspath = require('path');
const logger = require('./log');
const processor = require("./fsprocessor");
const Control = require('./control');
const extend = require('extend');
const Config = require("./config");
const Handlebars = require('./helpers').handlebars;

const logId = "generator-java : context";

function Context(id, config) {
  this.id = id;
  this.logger = logger;
  this.processor = processor;
  this.conf = extend(new Config(), config);   //start with a copy of the parent generator's config
  this.conf.configFiles = [];                 //remove any previously set config files (don't want to inherit those)
  this.patterns = [];
  this.paths = [];
  this.comps = [];

  this.addCompositions = (values) => {
    this.comps = values;
  }

  this.configure = (generator) => {
    this.conf.templateRoot = generator.templatePath();
    let control = new Control(fspath.resolve(this.conf.templateRoot, this.conf.createType), this.conf);
    this.paths = control.getComposition();
    this.comps.forEach(composition => {
      this.paths.push(fspath.resolve(this.conf.templateRoot, composition));
    });
    this.conf.processProject(this.paths);
    generator.destinationRoot(this.conf.projectPath);
  };

  this.defaultWriter = (generator) => {
    if(!this.paths.length) {
      return;   //not being written by us
    }
    this.logger.writeToLog(`${logId}:writing - Destination path`, generator.destinationRoot());
    return this.processor.scan(this.conf, (relativePath, template) => {
      let outFile = generator.destinationPath(relativePath);
      try {
        let compiledTemplate = Handlebars.compile(template);
        let output = compiledTemplate(this.conf);
        generator.fs.write(outFile, output);
      } catch (err) {
        this.logger.writeToLog(`${logId}:writing - Template error : ` + relativePath, err.message);
      }
    }, this.paths);
  }
}

module.exports = exports = Context;
