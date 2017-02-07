//module for processing the templates used by the generator

//first revision will read from the FS, using nodes in-built functions

var fs = require('fs');
var fspath = require('path');

var config = {};
var path = undefined;

//recursively walk the file tree starting from the specified root
var dirwalk = function(root, tracker) {
  fs.readdir(root, (err, files) => {
      if(err) {
        //TODO : appscan for Java does not like you putting too much info in the error messages, need to check for JS
        console.error("There was an error reading the template directory");
        return;
      }
      //now loop the files and add them to the store, need to add template processing somewhere in this stream
      tracker.count[root] = files.length;
      files.forEach((fileName, index) => {
        var file = fspath.resolve(root, fileName);
        var stats = fs.statSync(file);
        if(stats.isDirectory()) {
          tracker.count[root]--;    //immediately remove from count as not a file
          dirwalk(file, tracker);
        } else {
          fs.readFile(file, 'utf8', (err, data) => {
            var relativePath = file.substring(tracker.root.length);
            //make sure strip leading / to make path relative (and stop us writing to the root dir which would be bad)
            if(relativePath.charAt(0) == '/') {
              relativePath = relativePath.substring(1);
            }
            //console.log("Found file " + file + " : " + relativePath);
            tracker.count[root]--;  //remove from tracker when contents have been read
            if(err) {
              console.error("Error reading file ");
            } else {
              if(tracker.callback) {
                tracker.callback(relativePath, data);
              }
            }
            if(tracker.isComplete()) {
              console.log("FINISHED !!");
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
  console.log("Scanning " + this.path + " for files");
  var p = new Promise((resolve, reject) => {
    var tracker = {
      count : {},
      resolve : resolve,
      reject : reject,
      callback : cb,   //callback with file contents
      root : this.path,

      //the tracker is complete when all the declared directories have been processed
      isComplete : function() {
        for (var counter in this.count) {
          if (this.count.hasOwnProperty(counter)) {
            if(this.count[counter]) {
              return false;
            }
          }
        }
        return true;
      }
    }
    dirwalk(this.path, tracker);
  });
  return p;
}

module.exports = {
  config : config,
  path : path,
  scan : startWalk
};
