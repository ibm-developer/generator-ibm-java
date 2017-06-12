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
var defaults = require('../lib/defaults');

const PROMPT_ID = 'prompt:patterns';

function Extension(config) {
  this.id = PROMPT_ID;
  this.config = config;
}

Extension.prototype.getChoice = function() {
  return {
    name : 'Bluemix : generate source for Bluemix starters',
    value : PROMPT_ID,
    short : 'Bluemix source generation'
  };
}

Extension.prototype.show = function(answers) {
  var result = false;
  if (answers) {
    if(answers.promptType) {
      result = (answers.promptType === PROMPT_ID);
    } else {
      result = (this.config.promptType === PROMPT_ID);
    }
  }  else {
    result = (this.config.promptType === PROMPT_ID);
  }
  return result;
}

Extension.prototype.getQuestions = function() {
  return [{
    when    : this.show.bind(this),
    type    : 'list',
    name    : 'createType',
    message : 'What pattern do you want to generate source for?',
    choices : [{
      name : 'Basic : a basic Java microservice',
      value : 'basic',
      short : 'Basic Java microservice'
    }, {
      name : 'Microservice : a basic Java microservice',
      value : 'microservice',
      short : 'Basic Java microservice'
    }, {
      name : 'Basic Web : a basic web application',
      value : 'basicweb',
      short : 'Basic web application'
    }, {
      name : 'BFF : Backend For Frontend (generate java from Swagger/OpenAPI)',
      value : 'bff',
      short : 'Backend For Frontend'
    }],
    default : defaults.get('createType')
    }, {
      when    : this.show.bind(this),
      type    : 'list',
      name    : 'buildType',
      message : 'Select the build type for your project.\n',
      choices : ['maven', 'gradle'],
      default : defaults.get('buildType')
    }, {
      when    : this.show.bind(this),
      type    : 'input',
      name    : 'appName',
      message : 'Enter a name for your project',
      default : defaults.get('appName')
    }, {
      when    : this.show.bind(this),
      type    : 'input',
      name    : 'groupId',
      message : 'Enter a group id for your project',
      default : defaults.get('groupId')
    }, {
      when    : this.show.bind(this),
      type    : 'input',
      name    : 'artifactId',
      message : 'Enter an artifact id for your project',
      default : (answers) => {return answers.appName}
    }];
}

Extension.prototype.afterPrompt = function(answers, config) {
  config.apply(answers);
}

module.exports = exports = Extension;
