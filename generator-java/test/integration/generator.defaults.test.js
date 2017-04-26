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

/**
 * Tests the generator and the files written out
 */
'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var common = require('../lib/commontest');

describe('java generator integration test', function () {

  describe('Generates a basic project in headless mode, no configuration', function () {

    before(function () {
      // Mock the options, set up an output folder and run the generator
      return helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions({                       // Mock the prompt answers
          headless: "true",
          debug: "true",
        })
        .toPromise();                        // Get a Promise back when the generator finishes
    });



    it('should create a maven based project', function () {
      common.assertMavenFiles('LibertyProject');
    });

    it('should have carried out replacements', function () {
      assert.fileContent('pom.xml', '<groupId>liberty.projects</groupId>');
      assert.fileContent('pom.xml', '<artifactId>example</artifactId>');
      assert.fileContent('pom.xml', '<version>1.0-SNAPSHOT</version>');
    });

  });
});
