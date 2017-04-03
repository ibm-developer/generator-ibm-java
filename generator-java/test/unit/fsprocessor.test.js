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

//test the fs (file system) processor

var fs = require('fs');
var assert = require('assert');
var processor = require('../../generators/lib/fsprocessor');
var path = require('path');
var Config = require('../../generators/lib/config');

describe('fsprocessor library', function() {

  describe('processor does not allow invalid parameters', function() {
    it('it should throw an exception if the paths is not an array', function() {
      processor.paths = "string";
      assert.throws(()=>{processor.scan()})
    });
    it('it should throw an exception if the paths is an empty array', function() {
      processor.paths = [];
      assert.throws(()=>{processor.scan()})
    });
    it('it should throw an exception if the config is missing', function() {
      processor.paths = ["./test/resources/fsprocessor/test-templates-1file"];
      assert.throws(()=>{processor.scan()})
    });
  });

  describe('processor provides file operations', function() {
    it('it should throw an exception if the file does not exist', function() {
      assert.throws(()=>{processor.getContentsSync("madeupfilename.txt")})
    });
    it('it should throw an exception if the file is a directory', function() {
      assert.throws(()=>{processor.getContentsSync("./test/resources")})
    });
    it('it should get the contents of a file as a string', function() {
      var contents = processor.getContentsSync("./test/resources/fsprocessor/test-templates-1file/file-1.txt");
      assert.equal('string', typeof contents);
      assert(contents.indexOf('sample text file'));
    });
    it('it should get the contents of a file as a JSON object', function() {
      var contents = processor.getContentsSync("./test/resources/fsprocessor/sample.json");
      assert.equal('object', typeof contents);
      assert(contents.value);
    });
  });

  describe('walk tree specified with relative path', function() {
    it('it should walk a file system tree calling back when a file is found', function(done){
      processor.paths = ["./test/resources/fsprocessor/test-templates-1file"];
      processor.scan(new Config(), (relativePath, contents) => {
        assert.equal('file-1.txt', relativePath);
      }).then(() => { done(); })
        .catch((err) => { done(err);});
    });
    it('it should throw an exception for a non-existant path', function(done){
      processor.paths = ["./test/resources/fsprocessor/test-folder-does-not-exist"];
      processor.scan(new Config(), (relativePath, contents) => {
        assert.fail(false, true, "Should not have found any projects");
      }).then(() => { assert.fail(false, true, "Walk should not have completed without error"); })
        .catch((err) => {
          //this error is expected
          done();
        });
    });
    it('it should throw an exception when unable to read a file', function(done){
      if (path.delimiter === ';') {
        //can't check on Windows as can't set file permissions
        done();
        return;
      }
      var root = "./test/resources/fsprocessor/test-templates-badfile";
      var fpath = "/filewithnoreadperms.txt";
      fs.chmodSync(root + fpath, 222);
      processor.paths = [root];
      processor.scan(new Config(), (relativePath, contents) => {
        fs.chmodSync(root + fpath, 755);
        assert.fail(false, true, "Should not have found any projects");
      }).then(() => {
        fs.chmodSync(root + fpath, 755);
        assert.fail(false, true, "Walk should not have completed without error");
      }).catch((err) => {
        fs.chmodSync(root + fpath, 755);
        //this error is expected
        done();
      });
    });
  });

  describe('walk tree specified with an absolute path', function() {
    it('it should walk a file system tree calling back when a file is found', function(done){
      //path.resolve will convert to an absolute path
      processor.paths = [path.resolve("./test/resources/fsprocessor/test-templates-1file")];
      processor.scan(new Config(), (relativePath, contents) => {
        assert.equal('file-1.txt', relativePath);
      }).then(() => { done(); })
        .catch((err) => { done(err);});
    });
  });

  describe('walk tree ', function() {
    it('it should walk a file system tree (with empty dirs) calling back when a file is found', function(done){
      //these are the files that should be found
      var files = ['file-1.txt', 'file-2.txt', 'file-3.txt', 'file-4.txt', 'file-5.txt'];
      var separator = (path.delimiter === ';' ? "\\" : "/");
      var unknown = [];
      processor.paths = [path.resolve("./test/resources/fsprocessor/test-templates-emptyDirs"),
                        path.resolve("./test/resources/fsprocessor/test-templates-second")];
      processor.scan(new Config(), (relativePath, contents) => {
        for(var i = 0; i < files.length; i++) {
          if((relativePath === files[i]) || relativePath.endsWith(separator + files[i])) {
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
