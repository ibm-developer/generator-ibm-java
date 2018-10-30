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

//test the fs (file system) processor

'use strict';
const fs = require('fs');
const assert = require('assert');
const processor = require('../../lib/fsprocessor');
const path = require('path');
const Config = require('../../lib/config');

describe('fsprocessor library', function () {

  describe('processor does not allow invalid parameters', function () {
    it('it should throw an exception if the paths is not an array', function () {
      assert.throws(() => {
        processor.scan(undefined, undefined, "string")
      })
    });
    it('it should throw an exception if the paths is an empty array', function () {
      processor.paths = [];
      assert.throws(() => {
        processor.scan(undefined, undefined, [])
      })
    });
    it('it should throw an exception if the config is missing', function () {
      assert.throws(() => {
        processor.scan(undefined, undefined, ["./test/resources/fsprocessor/test-templates-1file"])
      })
    });
  });

  describe('processor provides file operations', function () {
    it('it should throw an exception if the file does not exist', function () {
      assert.throws(() => {
        processor.getContentsSync("madeupfilename.txt")
      })
    });
    it('it should throw an exception if the file is a directory', function () {
      assert.throws(() => {
        processor.getContentsSync("./test/resources")
      })
    });
    it('it should get the contents of a file as a string', function () {
      let contents = processor.getContentsSync("./test/resources/fsprocessor/test-templates-1file/file-1.txt");
      assert.equal('string', typeof contents);
      assert(contents.indexOf('sample text file'));
    });
    it('it should get the contents of a file as a JSON object', function () {
      let contents = processor.getContentsSync("./test/resources/fsprocessor/sample.json");
      assert.equal('object', typeof contents);
      assert(contents.value);
    });
  });

  describe('walk tree specified with relative path', function () {
    it('it should walk a file system tree calling back when a file is found', function (done) {
      processor.scan(new Config(), (relativePath) => {
        assert.equal('file-1.txt', relativePath);
      }, ["./test/resources/fsprocessor/test-templates-1file"]).then(() => {
        done();
      })
        .catch((err) => {
          done(err);
        });
    });
    it('it should throw an exception for a non-existant path', function (done) {
      processor.scan(new Config(), () => {
        assert.fail(false, true, "Should not have found any projects");
      }, ["./test/resources/fsprocessor/test-folder-does-not-exist"]).then(() => {
        assert.fail(false, true, "Walk should not have completed without error");
      })
        .catch(() => {
          //this error is expected
          done();
        });
    });
    it('it should throw an exception when unable to read a file', function (done) {
      if (path.delimiter === ';') {
        //can't check on Windows as can't set file permissions
        done();
        return;
      }
      let root = "./test/resources/fsprocessor/test-templates-badfile";
      let fpath = "/filewithnoreadperms.txt";
      fs.chmodSync(root + fpath, 222);
      processor.scan(new Config(), () => {
        fs.chmodSync(root + fpath, 755);
        assert.fail(false, true, "Should not have found any projects");
      }, [root]).then(() => {
        fs.chmodSync(root + fpath, 755);
        assert.fail(false, true, "Walk should not have completed without error");
      }).catch(() => {
        fs.chmodSync(root + fpath, 755);
        //this error is expected
        done();
      });
    });
  });

  describe('walk tree specified with an absolute path', function () {
    it('it should walk a file system tree calling back when a file is found', function (done) {
      //path.resolve will convert to an absolute path
      processor.scan(new Config(), (relativePath) => {
        assert.equal('file-1.txt', relativePath);
      }, [path.resolve("./test/resources/fsprocessor/test-templates-1file")]).then(() => {
        done();
      })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('walk tree ', function () {
    it('it should walk a file system tree (with empty dirs) calling back when a file is found', function (done) {
      //these are the files that should be found
      let files = ['file-1.txt', 'file-2.txt', 'file-3.txt', 'file-4.txt', 'file-5.txt'];
      let separator = (path.delimiter === ';' ? "\\" : "/");
      let unknown = [];
      let paths = [path.resolve("./test/resources/fsprocessor/test-templates-emptyDirs"),
        path.resolve("./test/resources/fsprocessor/test-templates-second")];
      processor.scan(new Config(), (relativePath) => {
        for (let i = 0; i < files.length; i++) {
          if ((relativePath === files[i]) || relativePath.endsWith(separator + files[i])) {
            //found a match so remove from the files list
            files.splice(i, 1);   //remove the item from the array
            //console.error("Removed [" + i + "]: " + files.length + " : " + JSON.stringify(files));
            return;
          }
        }
        //if get there then the file was not expected, so add it to the array for failure
        //console.error("Adding new file : " + relativePath);
        unknown.push(relativePath);
      }, paths).then(() => {
        if ((unknown.length == 0) && (files.length == 0)) {
          done();   //all done OK
        } else {
          done("Files not found or not expected : files = " + JSON.stringify(files) + ", unknown = " + JSON.stringify(unknown));
        }
      }).catch((err) => {
        done(err);
      });
    });
  });
});
