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

//test the controller

var assert = require('assert');
var Control = new require('../../generators/lib/control');
var path = require('path');
var config = require("../../generators/lib/config");

before(function() {
  config.data.templateRoot = path.resolve("./test/resources/control");
});

describe('control library', function() {

  describe('can create instances', function() {
    it('it should be possible to have more than one instance of a control', function(){
      var control = new Control("Path 1");
      var control2 = new Control("Path 2");
      assert.equal(false, control.getPath() === control2.getPath());
    });
  });

  describe('can find a control file', function() {
    it('it should find the control.js file in the root', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      var control = new Control(config.data.templateFullPath);
      assert.equal(true, control.hasControl());
    });

    it('it should ignore any control.js file not found in the root', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-control");
      var control = new Control(config.data.templateFullPath);
      assert.equal(false, control.hasControl());
    });

    it('it should throw an exception when the contol.js file does not contain valid javascript', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-invalid-control");
      assert.throws(() => {new Control(config.data.templateFullPath)});
    });
  });

  describe('process a control file', function() {
    it('it should exclude a file in the file exclusion list', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      var control = new Control(config.data.templateFullPath);
      assert.equal(false, control.shouldGenerate("build.gradle"));
    });

    it('it should include any file not in the file exclusion list', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      var control = new Control(config.data.templateFullPath);
      assert.equal(true, control.shouldGenerate("somefile.txt"));
    });

    it('it should exclude a directory in the directory exclusion list', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      var control = new Control(config.data.templateFullPath);
      assert.equal(false, control.shouldGenerate("donotprocess/file1.txt"));
    });

    it('it should support a composition element', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      var control = new Control(config.data.templateFullPath);
      assert(Array.isArray(control.getComposition()));
      assert(control.getComposition()[0].includes("subTemplate"));
    });

    it('it should support not having a composition element', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/no-composition");
      var control = new Control(config.data.templateFullPath);
      assert(Array.isArray(control.getComposition()));
      assert.equal(0, control.getComposition().length);
    });
  });

  describe('process found files', function() {
    it('it should use a custom fileFound callback if defined', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      var control = new Control(config.data.templateFullPath);
      var fragments = control.fileFound("path", "contents")
      assert.equal(1, fragments.length);
      assert.equal(fragments[0].path, "alteredpath");
    });

    it('it should use the default callback if no custom one is defined', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-excludes");
      var control = new Control(config.data.templateFullPath);
      var fragments = control.fileFound("path", "contents")
      assert.equal(1, fragments.length);
      assert.equal(fragments[0].path, "path");
    });
  });

  describe('generates file', function() {
    it('it should generate a file if a control block is not present', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-control");
      var control = new Control(config.data.templateFullPath);
      assert.equal(true, control.shouldGenerate());
    });

    it('it should generate a file if a control block present, but has no exclusions defined', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-excludes");
      var control = new Control(config.data.templateFullPath);
      assert.equal(true, control.shouldGenerate());
    });
  });

});
