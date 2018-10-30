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

// Set prompts for use by ibm-java-utils generator

'use strict'

const PROMPT_ID = 'prompt:spring'

function Extension (config) {
  this.id = PROMPT_ID
  this.config = config
  this.context = undefined
}

Extension.prototype.getChoice = function () {
  return {
    name: 'Spring : generate source for Spring .',
    value: PROMPT_ID,
    short: 'Technology selection'
  }
}

Extension.prototype.show = function (answers) {
  let result = false
  if (answers) {
    if (answers.promptType) {
      result = (answers.promptType === PROMPT_ID)
    } else {
      result = (this.config.promptType === PROMPT_ID)
    }
  } else {
    result = (this.config.promptType === PROMPT_ID)
  }
  return result
}

Extension.prototype.getQuestions = function () {
  return [{
    when: this.show.bind(this),
    type: 'list',
    name: 'createType',
    message: 'What type of source do you want to generate?',
    choices: [{
      name: 'Basic microservice',
      value: 'microservice/spring',
      short: 'A Spring based microservice'
    }]
  }, {
    when: this.show.bind(this),
    type: 'list',
    name: 'buildType',
    message: 'Select the build type for your project.\n',
    choices: ['maven', 'gradle'],
    default: 'maven'
  }, {
    when: this.show.bind(this),
    type: 'input',
    name: 'appName',
    message: 'Enter a name for your project',
    default: 'SpringProject'
  }, {
    when: this.show.bind(this),
    type: 'input',
    name: 'groupId',
    message: 'Enter a group id for your project',
    default: 'spring.projects'
  }, {
    when: this.show.bind(this),
    type: 'input',
    name: 'artifactId',
    message: 'Enter an artifact id for your project',
    default: (answers) => {return answers.appName}
  }, {
    when: this.show.bind(this),
    type: 'confirm',
    name: 'addbluemix',
    message: 'Add bluemix to your application?',
    default: false
  }, {
    when: this.show.bind(this),
    type: 'confirm',
    name: 'javametrics',
    message: 'Enable java metrics for your project',
    default: (answers) => {return answers.javametrics}
  }]
}

Extension.prototype.setContext = function (ctx) {
  this.context = ctx
}

Extension.prototype.afterPrompt = function (answers) {
  this.context.conf.overwrite(answers)
}

module.exports = exports = Extension
