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
  this.participant |= result;
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
    default : 0 // Default to rest sample
  }];
}

Extension.prototype.afterPrompt = function(answers, config) {
  //answers.bluemix is a JSON string and needs to be converted
  if(!this.participant) {
    return;   //hasn't participated in the questions.
  }
  if (typeof (answers.bluemix) === 'string') {
    answers.bluemix = JSON.parse(answers.bluemix);
  }
  config.bluemix = answers.bluemix || config.bluemix;
  if(config.bluemix) {
    config.appName = config.bluemix.name || answers.appName || config.appName;
  }
}

module.exports = exports = Extension;
