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

function ExtensionManager() {
  this.extensions = [];
  this.types = {};
  this.prompt = {
    type    : 'list',
    name    : 'extName',
    message : 'Select from the list of available generation options.\n',
    choices : []
  };
}

ExtensionManager.prototype.add = function(name) {
  var Ext = require('../extensions/' + name + '.js');
  var ext = new Ext();
  this.extensions.push(ext);

  var value = ext.getChoice();
  if(value) {
    this.prompt.choices.push(value);
  }

  //create an index of createType by extension
  var extqs = ext.getQuestions();
  for(var i = 0; i < extqs.length; i++) {
    if(extqs[i].name === 'createType') {
      for(var j = 0; j < extqs[i].choices.length; j++) {
        this.types[extqs[i].choices[j].value] = ext;
      }
      break;
    }
  }
}

ExtensionManager.prototype.getQuestions = function() {
  var questions = [];
  questions.push(this.prompt);
  for(var i = 0; i < this.extensions.length; i++) {
    questions = questions.concat(this.extensions[i].getQuestions());
  }
  return questions;
}

ExtensionManager.prototype.afterPrompt = function(answers, config, id) {
  var ext = undefined;
  if(id) {
    //execute by named ID
    for(var i = 0; i < this.extensions.length; i++) {
      if(this.extensions[i].id === id) {
        ext = this.extensions[i];
        break;
      }
    }
  } else {
    //execute by matching the create type
    ext = this.types[config.createType];
  }
  ext.afterPrompt(answers, config);
}

module.exports = exports = ExtensionManager;
