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
var control = require('../../generators/lib/control');
var path = require('path');
var config = require("../../generators/lib/config");

describe('control library', function() {

  describe('can find a control file', function() {
    it('it should find the control.json file in the root', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      control.processProject(config);
      assert.equal(true, control.hasControl());
    });

    it('it should ignore any control.json file not found in the root', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-control");
      control.processProject(config);
      assert.equal(false, control.hasControl());
    });
  });

  describe('process a control file', function() {
    it('it should exclude a file in the file exclusion list', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      control.processProject(config);
      assert.equal(false, control.shouldGenerate("build.gradle"));
    });

    it('it should include any file not in the file exclusion list', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      control.processProject(config);
      assert.equal(true, control.shouldGenerate("somefile.txt"));
    });
  });

  describe('process found files', function() {
    it('it should use a custom fileFound callback if defined', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/with-control");
      control.processProject(config);
      var fragments = control.fileFound("path", "contents")
      assert.equal(1, fragments.length);
      assert.equal(fragments[0].path, "alteredpath");
    });

    it('it should use the default callback if no custom one is defined', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-excludes");
      control.processProject(config);
      var fragments = control.fileFound("path", "contents")
      assert.equal(1, fragments.length);
      assert.equal(fragments[0].path, "path");
    });
  });

  describe('generates file', function() {
    it('it should generate a file if a control block is not present', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-control");
      control.processProject(config);
      assert.equal(true, control.shouldGenerate());
    });

    it('it should generate a file if a control block present, but has no exclusions defined', function(){
      config.data.templateFullPath = path.resolve("./test/resources/control/without-excludes");
      control.processProject(config);
      assert.equal(true, control.shouldGenerate());
    });
  });

});
