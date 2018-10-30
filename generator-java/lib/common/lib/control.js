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

//module for handling control directives in a control.json if it is present

'use strict';
const fs = require('fs');
const fspath = require('path');
const Handlebars = require('./helpers').handlebars;
const logger = require('./log');

const logId = "generator-java : control";

//determines if the passed relative path is a control file or not
const CONTROL_FILE = "control.js";
//determines if the passed relative path is a config file or not
const CONFIG_FILE = "config.js";

function Control(path, config) {
  if(!path) {
    throw 'Missing path parameter, unable to construct a Control.';
  }
  if(!config) {
    throw 'Missing config parameter, unable to construct a Control.';
  }
  this.path = path;   //this is immutable once created
  this.config = config;
  this.processProject();
}

Control.prototype.getPath = function() {
  return new String(this.path);
}

Control.prototype.isControl = function(relativePath) {
  return (relativePath === CONTROL_FILE);
}

Control.prototype.isConfig = function(relativePath) {
  return (relativePath === CONFIG_FILE);
}

//return true if a control block is active for this project
Control.prototype.hasControl = function() {
  return this.controlBlock != undefined;
}

//process a project looking for the control file, this is a sync operation
Control.prototype.processProject = function() {
  //see if control file exists
  this.controlBlock = undefined;    //remove any existing setting in case the files have been updated between invocations
  let file = fspath.resolve(this.path, CONTROL_FILE);
  if(!fs.existsSync(file)) {
    //console.log("Control file " + file + " does not exist");
    return;   //no additional control file found in this project
  }

  //it does, so parse it in and run it through Handlebars
  let template = fs.readFileSync(file, 'utf8');
  let compiledTemplate = Handlebars.compile(template);
  let output = compiledTemplate(this.config);
  try {
    this.controlBlock = eval("(" + output + ")");
    if(this.controlBlock) {
      this.controlBlock.subCompositions = {};
      if(this.controlBlock.composition) {
        let composition = this.controlBlock.composition.slice();
        this.controlBlock.composition = [];
        for(let i = 0; i < composition.length; i++) {
          if(composition[i].includes(':')) {
            //this is a sub-generator composition directive
            let components = composition[i].split(':');
            if(!this.controlBlock.subCompositions[components[0]]) {
              this.controlBlock.subCompositions[components[0]] = [components[1]];
            } else {
              this.controlBlock.subCompositions[components[0]].push(components[1]);
            }
          } else {
            //a direct inclusion for the current generator
            this.controlBlock.composition.push(fspath.resolve(this.config.templateRoot, composition[i]));
          }
        }
        this.controlBlock.composition.push(fspath.resolve(this.config.templateRoot, this.config.createType));
      }
    }
  } catch (err) {
    logger.writeToLog(`${logId}:control -  Control block error in template`, template);
    throw err;
  }
}

//controls whether or not a file should be included in a generation
Control.prototype.shouldGenerate = function(relativePath) {
  if(!this.controlBlock) {
    return true;   //no control block configured so generate
  }
  if(!this.controlBlock.excludes && !this.controlBlock.excludesDir) {
    return true;   //no excludes defined
  }
  if (this.controlBlock.excludes) {
    for(let i = 0; i < this.controlBlock.excludes.length; i++) {
      if(fspath.resolve(this.controlBlock.excludes[i]) === fspath.resolve(relativePath)) {
        // console.log("File excluded : " + relativePath);
        return false;
      }
    }
  }
  if (this.controlBlock.excludesDir) {
    for(let i = 0; i < this.controlBlock.excludesDir.length; i++) {
      let path = fspath.parse(relativePath);
      if(fspath.resolve(path.dir) === fspath.resolve(this.controlBlock.excludesDir[i])) {
        //console.log("Directory excluded : " + relativePath);
        return false;
      }
    }
  }
  //if get this far, then include the file in the processing
  return true;
}

Control.prototype.fileFound = function(relativePath, contents) {
  if(this.controlBlock && this.controlBlock.fileFound) {
    return this.controlBlock.fileFound(relativePath, contents, this.config);
  } else {
    return [{path : relativePath, template : contents, data : this.config}];
  }
}

//return a string array for the composition of this template
Control.prototype.getComposition = function() {
  if(this.controlBlock && this.controlBlock.composition) {
    return this.controlBlock.composition;
  } else {
    return [];
  }
}

//return sub compositions for a named generator
Control.prototype.getSubComposition = function(name) {
  if(this.controlBlock && this.controlBlock.subCompositions[name]) {
    return this.controlBlock.subCompositions[name];
  } else {
    return [];
  }
}

module.exports = exports = Control;
