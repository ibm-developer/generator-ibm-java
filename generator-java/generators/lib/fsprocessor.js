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

//module for processing the templates used by the generator

//first revision will read from the FS, using nodes in-built functions

var fs = require('fs');
var fspath = require('path');
var Control = require('./control');
var logger = require('./log');
var config = require('./config');

var paths = [];
var id = 0;

//recursively walk the file tree starting from the specified root
var dirwalk = function(root, tracker, resolver) {
  tracker.count[root] = undefined;    //mark that the directory is being processed
  fs.readdir(root, (err, files) => {
      if(err) {
        //TODO : appscan for Java does not like you putting too much info in the error messages, need to check for JS
        console.error("There was an error reading the template directory");
        logger.writeToLog("Folder error", err);
        resolver.reject(err);
        return;
      }
      //now loop the files and add them to the store, need to add template processing somewhere in this stream
      tracker.count[root] = files.length;
      files.forEach((fileName, index) => {
        var file = fspath.resolve(root, fileName);
        var stats = fs.statSync(file);
        if(stats.isDirectory()) {
          dirwalk(file, tracker, resolver);
          tracker.count[root]--;    //immediately remove from count as not a file
        } else {
          fs.readFile(file, 'utf8', (err, data) => {
            var relativePath = fspath.relative(tracker.root, file);
            //console.log("Found file " + file + " : " + relativePath);
            if(err) {
              console.error("Error reading file ");
              logger.writeToLog("File error", err);
              resolver.reject(err);
              return;
            }
            if(tracker.control.isControl(relativePath)) {
              //console.log("CONTROL FILE found, skipping processing");
            } else {
              //fileFound passes back an array of fragments so that data can be repeated
              var fragments = tracker.control.fileFound(relativePath, data);
              if(tracker.callback) {
                fragments.forEach((fragment) => {
                  if(tracker.control.shouldGenerate(fragment.path)) {
                    tracker.callback(fragment.path, fragment.template, fragment.data);
                  }
                });
              }
            }
            tracker.count[root]--;  //remove from tracker when contents have been read and callbacks made
            resolver.canResolve();
          });
        }
      });
  });
}


function Resolver() {
  this.resolve = undefined;
  this.reject = undefined;
  this.trackers = [];
  this.canResolve = function() {
    for (var i=0 ; i < this.trackers.length ; i++) {
      if(this.trackers[i] == undefined) {
        /* istanbul ignore next */    //ignoring as entering this branch depends on callback order and is not consistently reproducible
        return;   //this is one in process
      }
      var count = this.trackers[i].count;
      for (var counter in count) {
        if (count.hasOwnProperty(counter)) {
          if((count[counter] == undefined) || count[counter]) {
            return;
          }
        }
      }
    }
    this.resolve();
  };
}

//return a promise that will complete when all files have been processed
//used to ensure the generator does not move beyond the current lifecycle step
var startWalk = function(cb) {
  if (!Array.isArray(this.paths)) {
    throw 'Paths is not an array.';
  }
  if (!this.paths.length) {
    throw 'No paths have been specified for the templates.';
  }
  var resolver = new Resolver();
  resolver.trackers = [];
  for (var i=0 ; i < this.paths.length ; i++) {
    var absolutePath = fspath.resolve(this.paths[i]);
    resolver.trackers.push({
      id : id++,
      count : {},
      callback : cb,   //callback with file contents
      root : absolutePath,
      control : new Control(absolutePath, config)
    });
  }

  var p = new Promise((resolve, reject) => {
    resolver.resolve = resolve;
    resolver.reject = reject;
    for (var i=0 ; i < resolver.trackers.length ; i++) {
      dirwalk(resolver.trackers[i].root, resolver.trackers[i], resolver);
    }
  });
  return p;
}

//synchronous synchronously get the contents of a file
var getContentsSync = function(value) {
  var file = fspath.resolve(value);
  if(!fs.existsSync(file)) {
    logger.writeToLog("Error : specified file does not exist", file);
    throw "Error : specified file does not exist";
  }
  var stats = fs.statSync(file);
  if(stats.isDirectory()) {
    logger.writeToLog("Error : specified path is a directory", file);
    throw "Error : specified path is a directory";
  }
  try {
    var contents = fs.readFileSync(file, 'utf8');
    try {
      return JSON.parse(contents);
    } catch(err) {
      //not a JSON object, so just return the string
      return contents;
    }
  } catch (err) {
    /* istanbul ignore next */    //file error reading checked in other tests
    logger.writeToLog("Error : reading : " + file, err);
    /* istanbul ignore next */
    throw err;
  }
}

module.exports = {
  paths : paths,
  scan : startWalk,
  getContentsSync : getContentsSync
};
