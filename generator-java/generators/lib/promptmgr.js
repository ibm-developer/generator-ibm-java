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

function PromptManager(config) {
  this.prompts = [];
  this.types = {};
  this.prompt = {
    type    : 'list',
    name    : 'promptType',
    message : 'Select from the list of available generation options.\n',
    choices : []
  };
  this.config = config;
}

PromptManager.prototype.add = function(name) {
  var Ext = require('../prompts/' + name + '.js');
  var ext = new Ext(this.config);
  this.prompts.push(ext);

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

PromptManager.prototype.getQuestions = function() {
  var questions = [];
  questions.push(this.prompt);
  for(var i = 0; i < this.prompts.length; i++) {
    questions = questions.concat(this.prompts[i].getQuestions());
  }
  return questions;
}

//this was run headless, so need to work out which extension provides the selected createType
PromptManager.prototype.setExtension = function(createType) {
  for (var type in this.types) {
    if (this.types.hasOwnProperty(type)) {
      if(type === createType) {
        answers.promptType = this.types[type].id;
        break;
      }
    }
  }
}

PromptManager.prototype.afterPrompt = function(answers, config) {
  for(var i = 0; i < this.prompts.length; i++) {
    var prompt = this.prompts[i];
    var questions = prompt.getQuestions();
    var promptAnswers = {};
    for(var j = 0; j < questions.length; j++) {
      var name = questions[j].name;
      if(answers[name]) {
        promptAnswers[name] = answers[name];
      }
    }
    if(Object.keys(promptAnswers)) {
      this.prompts[i].afterPrompt(promptAnswers, config);
    }
  }
}

module.exports = exports = PromptManager;
