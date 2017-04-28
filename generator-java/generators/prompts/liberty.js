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

function Extension() {
  this.id = PROMPT_ID;
}

Extension.prototype.getChoice = function() {
  return {
    name : 'Liberty : generate source for WebSphere Liberty.',
    value : PROMPT_ID,
    short : 'Technology selection'
  };
}

Extension.prototype.show = function(answers) {
  return answers && (answers.promptType === PROMPT_ID);
}

Extension.prototype.getQuestions = function() {
  return [{
    when    : this.show,
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
    when : this.show,
    type : 'checkbox',
    name : 'technologies',
    message : 'Select the technologies for your project.',
    choices : ['rest'],
    default : 0 // Default to rest
  }, {
    when : this.show,
    type : 'confirm',
    name : 'addbluemix',
    message : 'Add bluemix to your application?',
    default : false
  }];
}

Extension.prototype.afterPrompt = function(answers, config) {
  //do nothing
}

module.exports = exports = Extension;
