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

const EXT_ID = 'ext:picnmix';

function Extension() {
  this.id = EXT_ID;
}

Extension.prototype.getChoice = function() {
  return {
    name : 'App Accelerator : generate source by selecting technologies.\n',
    value : EXT_ID,
    short : 'Technology selection'
  };
}

Extension.prototype.getServices = function() {
  return undefined;
}

Extension.prototype.show = function(answers) {
  return answers && (answers.extName === EXT_ID);
}

Extension.prototype.getQuestions = function() {
  return [{
    when    : this.show,
    type    : 'list',
    name    : 'createType',
    message : 'Pic \'n\' Mix : Choose from a selection of technologies',
    choices : [{
      name : 'Pic\'n\'Mix : a technology selection',
      value : 'picnmix',
      short : 'Basic technology selection'
    }]
    }, {
    when : this.show,
    type : 'checkbox',
    name : 'technologies',
    message : 'Select the technologies for your project.\n',
    choices : ['rest'],
    default : 0 // Default to rest
  }];
}

Extension.prototype.afterPrompt = function(answers, config) {
  //do nothing
}

module.exports = exports = Extension;
