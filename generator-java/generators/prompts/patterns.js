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

const PROMPT_ID = 'prompt:patterns'

function Extension (config) {
  this.id = PROMPT_ID
  this.config = config
}

Extension.prototype.getChoice = function () {
  return {
    name: 'Bluemix : generate source for Bluemix starters',
    value: PROMPT_ID,
    short: 'Bluemix source generation'
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
    message: 'What pattern do you want to generate source for?',
    choices: [{
      name: 'Blank : a simple MicroProfile / JavaEE application',
      value: 'blank/liberty',
      short: 'Blank MicroProfile / JavaEE'
    }, {
      name: 'Blank : a simple Spring application',
      value: 'blank/spring',
      short: 'Blank Spring'
    }, {
      name: 'Basic : IBM Cloud enablement for a MicroProfile / JavaEE application',
      value: 'enable/liberty',
      short: 'Enablement for MicroProfile / JavaEE'
    }, {
      name: 'Basic : IBM Cloud enablement for a Spring application',
      value: 'enable/spring',
      short: 'Enablement for Spring'
    }, {
      name: 'Microservice : a basic MicroProfile / JavaEE microservice',
      value: 'microservice/liberty',
      short: 'Basic JavaEE microservice'
    }, {
      name: 'Microservice : a basic Spring microservice',
      value: 'microservice/spring',
      short: 'Basic Spring microservice'
    }, {
      name: 'Basic Web : a basic MicroProfile / JavaEE web application',
      value: 'basicweb/liberty',
      short: 'Basic JavaEE web application'
    }, {
      name: 'Basic Web : a basic Spring web application',
      value: 'basicweb/spring',
      short: 'Basic Spring web application'
    }, {
      name: 'BFF : Backend For Frontend (generate Microprofile/JavaEE code from Swagger/OpenAPI)',
      value: 'bff/liberty',
      short: 'Backend For Frontend'
    }, {
      name: 'BFF : Backend For Frontend (generate Spring code from Swagger/OpenAPI)',
      value: 'bff/spring',
      short: 'Backend For Frontend'
    }],
    default: this.config.createType
  }, {
    when: this.show.bind(this),
    type: 'list',
    name: 'buildType',
    message: 'Select the build type for your project.\n',
    choices: ['maven', 'gradle'],
    default: this.config.buildType
  }, {
    when: this.show.bind(this),
    type: 'input',
    name: 'appName',
    message: 'Enter a name for your project',
    default: this.config.appName
  }, {
    when: this.show.bind(this),
    type: 'input',
    name: 'groupId',
    message: 'Enter a group id for your project',
    default: this.config.groupId
  }, {
    when: this.show.bind(this),
    type: 'input',
    name: 'artifactId',
    message: 'Enter an artifact id for your project',
    default: (answers) => {return this.config.artifactId || answers.appName}
  }]
}

Extension.prototype.afterPrompt = function (answers, config) {
  config.overwrite(answers)
}

module.exports = exports = Extension
