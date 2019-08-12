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
    this.logger.writeToLog(`${logId}:constructor -  conf (final)`, this.conf);
  }

  initializing() {
  }

  prompting() {
    //this generator does not prompt, questions can be set in the prompts directory for testing purposes
  }

  configuring() {
    this.configure(this);
  }

  writing() {
    return this.defaultWriter(this);   //use the default writer supplied by the context.
  }

  end() {
  }

};