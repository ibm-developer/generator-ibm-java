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

//module for handling control directives in a control.json if it is present

var fs = require('fs');
var fspath = require('path');
var Mustache = require('mustache');
var controlBlock = undefined;
var config = undefined;   //configuration for this project
var javarules = require('./javarules');

//determines if the passed relative path is a control file or not
const CONTROL_FILE = "control.json";
var isControl = function(relativePath) {
  return (relativePath === CONTROL_FILE);
}

//return true if a control block is active for this project
var hasControl = function() {
  return this.controlBlock != undefined;
}

//process a project looking for the control file, this is a sync operation
var processProject = function(config) {
  //see if control file exists
  this.controlBlock = undefined;    //remove any existing setting in case the files have been updated between invocations
  var file = fspath.resolve(config.data.templateFullPath, CONTROL_FILE);
  if(!fs.existsSync(file)) {
    //console.log("Control file " + file + " does not exist");
    return;   //no additional control file found in this project
  }

  //it does, so parse it in and run it through Mustache
  var template = fs.readFileSync(file, 'utf8');
  var data = {};
  data[config.data.buildType] = true;

  var output = Mustache.render(template, data);
  this.controlBlock = eval("(" + output + ")");
  //console.log("Control data : \n" + JSON.stringify(this.controlBlock));
  this.config = config;     //keep a ref to the config
}

//controls whether or not a file should be included in a generation
var shouldGenerate = function(relativePath) {
  if(!this.controlBlock) {
    return false;   //no control block configured so skip
  }
  if(!this.controlBlock.excludes) {
    return false;   //no excludes defined
  }
  for(var i = 0; i < this.controlBlock.excludes.length; i++) {
    if(this.controlBlock.excludes[i] === relativePath) {
      //console.log("File exculed : " + relativePath);
      return false;
    }
  }
  //if get this far, then include the file in the processing
  return true;
}

var fileFound = function(relativePath, contents) {
  if(this.controlBlock && this.controlBlock.fileFound) {
    return this.controlBlock.fileFound(relativePath, contents, this.config);
  } else {
    return [{path : relativePath, template : contents, data : this.config}];
  }
}

module.exports = {
  isControl : isControl,
  hasControl : hasControl,
  processProject : processProject,
  shouldGenerate : shouldGenerate,
  fileFound : fileFound
};
