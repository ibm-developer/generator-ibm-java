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

//configuration module for controlling the template creation.

const PATTERN_NAME = new RegExp("^[a-zA-Z0-9_-]+$");
const PATTERN_ARTIFACT_ID = new RegExp("^[a-zA-Z0-9-_.]*$");

var config = {
  appName : "myLibertyProject",
  buildType : "maven",
  artifactId : "artifactId",
  groupId : "groupId",
  version : "1.0",
  headless : "false",
  createType : "rest",
  debug : "false",
  bluemix : undefined,
  input : undefined
};    //the configuration object

var isValid = function() {
  var value = config.appName;
  if(!value || !PATTERN_NAME.test(value) || (value.length > 50)) return false;
  value = config.artifactId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  value = config.groupId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  return true;
}

var reset = function() {
  this.config = {};
  config.appName = "myLibertyProject";
  config.buildType = "maven";
  config.artifactId = "artifactId";
  config.groupId = "groupId";
  config.version = "1.0";
  config.headless = "false";
  config.createType = "rest";
  config.debug = "false";
  config.bluemix = undefined;
  config.input = undefined;
}

module.exports = {
  isValid : isValid,
  data : config,
  reset : reset
}
