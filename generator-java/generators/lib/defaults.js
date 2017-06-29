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

//module for storing default configuration values

const processor = require('@arf/java-common').fsprocessor;

const DEFAULTS = {
  appName : {desc : 'Name of the application', type : String, default : 'LibertyProject'},
  buildType : {desc : 'Build system to use', type : String, default : 'maven'},
  promptType : {desc : 'The prompts to use', type : String, default : 'prompt:patterns'},
  createType : {desc : 'Type of application to generate', type : String, default : 'basic'},
  groupId : {desc : 'Group ID to use for the build', type : String, default : 'liberty.projects'},
  artifactId : {desc : 'Artifact ID to use for the build', type : String, default : 'example'},
  version : {desc : 'Version of the application', type : String, default : '1.0-SNAPSHOT'},
  headless : {desc : 'Run this generator headless i.e. driven by options only, no prompting', type : String, default : "false"},
  debug : {desc : 'Generate a log.txt file in the root of the project', type : String, default : "false"},
  bluemix : {desc : 'Bluemix options', type : (value)=>{return toObject(value);}, default : undefined},
  input : {desc : 'Input data file', type : processor.getContentsSync, default : undefined},
  technologies : {desc : 'Technologies to configure when using the prompt:liberty promptType', type : (value)=>{return Array.isArray(value) ? value : value.split(",");}, default : []}
};

var getDefaultObject = function(name) {
  return DEFAULTS[name];
}

var get = function(name) {
  if (name === undefined) {
    return Object.keys(DEFAULTS);
  } else {
    return DEFAULTS[name].default;
  }
}

var toObject = function(value) {
  if(typeof value == 'string') {
    return JSON.parse(value);
  }
  if(typeof value === 'object') {
    return value;
  }
  return value;
}

module.exports = {
  getObject : getDefaultObject,
  get : get
};
