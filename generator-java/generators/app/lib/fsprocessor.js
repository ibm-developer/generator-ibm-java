//module for processing the templates used by the generator

//first revision will read from the FS, using nodes in-built functions

var fs = require('fs');
var fspath = require('path');

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
            var relativePath = file.substring(tracker.root.length);
            //make sure strip leading / to make path relative (and stop us writing to the root dir which would be bad)
            if(relativePath.charAt(0) == '/') {
              relativePath = relativePath.substring(1);
            }
            //console.log("Found file " + file + " : " + relativePath);
            if(err) {
              console.error("Error reading file ");
              tracker.reject(err);
              return;
            }
            if(tracker.callback) {
              tracker.callback(relativePath, data);
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
