//test the fs (file system) processor

var assert = require('assert');
var processor = require('../generators/app/lib/fsprocessor');
var path = require('path');

describe('fsprocessor library', function() {

  describe('walk tree specified with relative path', function() {
    it('it should walk a file system tree calling back when a file is found', function(done){
      processor.path = "./test/resources/test-templates-1file";
      processor.scan((relativePath, contents) => {
        assert.equal('file-1.txt', relativePath);
      }).then(() => { done(); })
        .catch((err) => { done(err);});
    });
  });

  describe('walk tree specified with an absolute path', function() {
    it('it should walk a file system tree calling back when a file is found', function(done){
      //path.resolve will convert to an absolute path
      processor.path = path.resolve("./test/resources/test-templates-1file");
      processor.scan((relativePath, contents) => {
        assert.equal('file-1.txt', relativePath);
      }).then(() => { done(); })
        .catch((err) => { done(err);});
    });
  });

  describe('walk tree ', function() {
    it('it should walk a file system tree (with empty dirs) calling back when a file is found', function(done){
      //these are the files that should be found
      var files = ['folder1/folder2/file-1.txt', 'folder1/folder2/folder3/folder4/file-2.txt', 'folder1/folder2/folder3/folder4/file-3.txt'];
      var unknown = [];
      processor.path = path.resolve("./test/resources/test-templates-emptyDirs");
      processor.scan((relativePath, contents) => {
        for(var i = 0; i < files.length; i++) {
          if(files[i] === relativePath) {
            //found a match so remove from the files list
            files.splice(i, 1);   //remove the item from the array
            //console.error("Removed [" + i + "]: " + files.length + " : " + JSON.stringify(files));
            return;
          }
        }
        //if get there then the file was not expected, so add it to the array for failure
        //console.error("Adding new file : " + relativePath);
        unknown.push(relativePath);
      }).then(() => {
        if((unknown.length == 0) && (files.length == 0)) {
          done();   //all done OK
        } else {
          done("Files not found or not expected : files = " + JSON.stringify(files) + ", unknown = " + JSON.stringify(unknown));
        }
      }).catch((err) => { done(err);});
    });
  });
});
