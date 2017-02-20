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

var config = {};
var path = undefined;
var id = 0;

//recursively walk the file tree starting from the specified root
var dirwalk = function(root, tracker) {
  tracker.count[root] = undefined;    //mark that the directory is being processed
  fs.readdir(root, (err, files) => {
      if(err) {
        //TODO : appscan for Java does not like you putting too much info in the error messages, need to check for JS
        console.error("There was an error reading the template directory");
        tracker.reject(err);
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
              tracker.reject(err);
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
            tracker.count[root]--;  //remove from tracker when contents have been read and callbacks made
            if(tracker.isComplete()) {
              tracker.resolve();
            }
          });
        }
      });
  });
}

//return a promise that will complete when all files have been processed
//used to ensure the generator does not move beyond the current lifecycle step
var startWalk = function(cb) {
  var fullpath = fspath.resolve(this.path);
  var trackerId = id++;
  //console.log("Scanning " + fullpath + " for files");
  var p = new Promise((resolve, reject) => {
    var tracker = {
      id : trackerId,
      count : {},
      resolve : resolve,
      reject : reject,
      callback : cb,   //callback with file contents
      root : fullpath,

      //the tracker is complete when all the declared directories have been processed
      isComplete : function() {
        for (var counter in this.count) {
          if (this.count.hasOwnProperty(counter)) {
            if((this.count[counter] == undefined) || this.count[counter]) {
              return false;
            }
          }
        }
        return true;
      }
    }
    dirwalk(tracker.root, tracker);
  });
  return p;
}

module.exports = {
  config : config,
  path : path,
  scan : startWalk
};
