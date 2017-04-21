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

var logger = require("../lib/log");

const PROMPT_ID = 'ext:common';

function Extension() {
  this.id = PROMPT_ID;
}

Extension.prototype.getChoice = function() {
  return undefined;
}

Extension.prototype.show = function(answers) {
  return true;
}

Extension.prototype.getQuestions = function() {
  return [{
    type    : 'list',
    name    : 'buildType',
    message : 'Select the build type for your project.\n',
    choices : ['maven', 'gradle'],
    default : 0 // Default to maven
  }, {
    type    : 'input',
    name    : 'appName',
    message : 'Enter a name for your project',
    default : "myProject"
  }];
}

Extension.prototype.afterPrompt = function(answers, config) {
  //configure the sample to use based on the type we are creating
  if(answers.createType) {
    config.createType = answers.createType;
    config.templateName = answers.createType;   //override with user selection
  }
  config.buildType = answers.buildType || config.buildType;
  if(config.artifactId === 'example') {
    config.artifactId = config.appName;
  }
  config.appName = answers.appName || config.appName;
}

module.exports = exports = Extension;
