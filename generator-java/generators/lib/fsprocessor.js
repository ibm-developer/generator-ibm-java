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
var control = require('./control');
var logger = require('./log');

var config = {};
var path = undefined;
var id = 0;

//recursively walk the file tree starting from the specified root
var dirwalk = function(root, tracker, checkPromiseStatus, reject) {
  tracker.count[root] = undefined;    //mark that the directory is being processed
  console.log("PromiseStatus: " + JSON.stringify(checkPromiseStatus));
  fs.readdir(root, (err, files) => {
      if(err) {
        //TODO : appscan for Java does not like you putting too much info in the error messages, need to check for JS
        console.error("There was an error reading the template directory");
        console.error(err);
        logger.writeToLog("Folder error", err);
        reject(err);
        return;
      }
      //now loop the files and add them to the store, need to add template processing somewhere in this stream
      tracker.count[root] = files.length;
      files.forEach((fileName, index) => {
        var file = fspath.resolve(root, fileName);
        var stats = fs.statSync(file);
        if(stats.isDirectory()) {
          dirwalk(file, tracker);
          tracker.count[root]--;    //immediately remove from count as not a file
        } else {
          fs.readFile(file, 'utf8', (err, data) => {
            var relativePath = fspath.relative(tracker.root, file);
            //console.log("Found file " + file + " : " + relativePath);
            if(err) {
              console.error("Error reading file ");
              console.error(err);
              logger.writeToLog("File error", err);
              reject(err);
              return;
            }
            if(control.isControl(relativePath)) {
              //console.log("CONTROL FILE found, skipping processing");
            } else {
              //fileFound passes back an array of fragments so that data can be repeated
              var fragments = control.fileFound(relativePath, data);
              if(tracker.callback) {
                fragments.forEach((fragment) => {
                  tracker.callback(fragment.path, fragment.template, fragment.data);
                });
              }
            }
            console.log("PromiseStatus inside: " + JSON.stringify(checkPromiseStatus));
            tracker.count[root]--;  //remove from tracker when contents have been read and callbacks made
            checkPromiseStatus();
          });
        }
      });
  });
}



//return a promise that will complete when all files have been processed
//used to ensure the generator does not move beyond the current lifecycle step
var startWalk = function(cb) {
  if (!Array.isArray(this.path)) {
    throw 'Path is not an array.';
  }
  var trackers = [];
  for (var i=0 ; i < this.path.length ; i++) {
    trackers.push({
      id : this.id++,
      count : {},
      callback : cb,   //callback with file contents
      root : fspath.resolve(this.path[i])})
  }

  //console.log("Scanning " + fullpath + " for files");
  var p = new Promise((resolve, reject) => {
    var canResolve = function() {
      for (var i=0 ; i < trackers.length ; i++) {
        var count = trackers[i].count;
        for (var counter in count) {
          if (count.hasOwnProperty(counter)) {
            if((count[counter] == undefined) || count[counter]) {
              return;
            }
          }
        }
      }
      resolve();
    }
    for (var i=0 ; i < trackers.length ; i++) {
      dirwalk(trackers[i].root, trackers[i], canResolve, reject);
    }
  });
  return p;
}

module.exports = {
  config : config,
  path : path,
  scan : startWalk
};
