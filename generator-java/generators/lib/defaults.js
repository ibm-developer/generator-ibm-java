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

//module for storing default configuration values

'use strict'

const processor = require('../../lib/common').fsprocessor;
const defaultsModule = require('../../lib/common').defaults;

const DEFAULTS = {
  appName : {desc : 'Name of the application', type : String, default : 'MyProject'},
  buildType : {desc : 'Build system to use', type : String, default : 'maven'},
  createType : {desc : 'Type of application to generate', type : String, default : 'microservice/liberty'},
  frameworkType : {desc : 'Framework to generate Java code for', type : String, default : 'liberty'},
  groupId : {desc : 'Group ID to use for the build', type : String, default : 'projects'},
  artifactId : {desc : 'Artifact ID to use for the build', type : String, default : undefined},
  version : {desc : 'Version of the application', type : String, default : '1.0-SNAPSHOT'},
  bluemix : {desc : 'Bluemix options', type : (value)=>{return bluemixToObject(value);}, default : undefined},
  input : {desc : 'Input data file', type : processor.getContentsSync, default : undefined},
  platforms : {desc : 'Platforms to support in generated project', type : (value)=>{return platformsToArray(value);}, default : ['cli','bluemix','kube']},
  javametrics : {desc : 'Enable java metrics for the project', type : String, default : undefined},
  deploymentRegion : {desc : 'Toolchain deployment region', type : String, default : undefined},
  deploymentOrg : {desc : 'Toolchain deployment org', type : String, default : undefined},
  deploymentSpace : {desc : 'Toolchain deployment space', type : String, default : undefined},
  toolchainName : {desc : 'Toolchain name', type : String, default : undefined}
};

const bluemixToObject = function(value) {
  let type = Object.prototype.toString.call(value);
  if(type === '[object String]') {
    return JSON.parse(value);
  }
  if(type === '[object Object]') {
    return value;
  }
  throw new Error('bluemixToObject expects an Object or a String, got ' + JSON.stringify(value));
}

const platformsToArray = function(value) {
  if(Array.isArray(value)) {
    return value;
  }
  if(value === "") {
    return [];
  }
  return value.split(",");
}

module.exports = class extends defaultsModule {
  constructor() {
    super(DEFAULTS)
  }
}
