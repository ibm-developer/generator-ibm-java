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

var fs = require('fs');
var fspath = require('path');
var Handlebars = require('handlebars');

const PATTERN_NAME = new RegExp("^[a-zA-Z0-9_-]+$");
const PATTERN_ARTIFACT_ID = new RegExp("^[a-zA-Z0-9-_.]*$");
const CONFIG_FILE = "config.js";

function Config() {
  this.reset();
};    //the configuration object

Config.prototype.isValid = function() {
  var value = this.appName;
  if(!value || !PATTERN_NAME.test(value) || (value.length > 50)) return false;
  value = this.artifactId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  value = this.groupId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  return true;
}

Config.prototype.reset = function() {
  this.appName = "myLibertyProject";
  this.buildType = "maven";
  this.artifactId = "artifactId";
  this.groupId = "groupId";
  this.version = "1.0";
  this.headless = "false";
  this.createType = "rest";
  this.debug = "false";
  this.bluemix = undefined;
  this.input = undefined;
  this.technologies = [];
}

Config.prototype.processProject = function(paths) {
  for(var i = 0; i < paths.length; i++) {
    var file = fspath.resolve(paths[i], CONFIG_FILE);
    if(fs.existsSync(file)) {
      if(this.configFiles) {
        this.configFiles.push(file);
      }else {
        this.configFiles = [file];
      }
    }
  }
  if (this.configFiles) {
    for(var i = 0; i < this.configFiles.length; i++) {
      var template = fs.readFileSync(this.configFiles[i], 'utf8');
      var compiledTemplate = Handlebars.compile(template);
      var output = compiledTemplate(this);
      var fileContent = eval("(" + output + ")");
      for(var array in fileContent) {
        this.processArray(fileContent, array);
      }
    }
  }
}

Config.prototype.processArray = function(content, objectsName) {
  for(var i = 0; i < content[objectsName].length; i++) {
    var object = content[objectsName][i];
    if(this[objectsName]) {
      this[objectsName].push(object);
    } else {
      this[objectsName] = [object];
    }
  }
}

module.exports = exports = Config;
