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

const PROMPT_ID = 'prompt:liberty';

function Extension(config) {
  this.id = PROMPT_ID;
  this.config = config;
}

Extension.prototype.getChoice = function() {
  return {
    name : 'Liberty : generate source for WebSphere Liberty.',
    value : PROMPT_ID,
    short : 'Technology selection'
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
    message : 'What type of source do you want to generate?',
    choices : [{
      name : 'Pic\'n\'Mix : pick from a list of technologies',
      value : 'picnmix',
      short : 'Basic technology selection'
    }, {
      name : 'Microservice Builder : develop and deliver microservices, hybrid and containerized apps',
      value : 'technologies/msbuilder',
      short : 'Microservice Builder'
    }]
    }, {
    when : this.show.bind(this),
    type : 'checkbox',
    name : 'technologies',
    message : 'Select the technologies for your project.',
    choices : [{name: 'rest'}, {name: 'microprofile'}, {name: 'persistence'}, {name: 'websockets'}, {name: 'servlet'}, {name: 'watsonsdk'}, {name: 'swagger'}, {name: 'springboot_web'}],
    validate : function (answer) {
      if (answer.length < 1) {
        return 'You must choose at least one technology.';
      }
      return true;
    }
  }, {
    when : this.show.bind(this),
    type : 'confirm',
    name : 'addbluemix',
    message : 'Add bluemix to your application?',
    default : false
  }];
}

Extension.prototype.afterPrompt = function(answers, config) {
  config.apply(answers);
}

module.exports = exports = Extension;
