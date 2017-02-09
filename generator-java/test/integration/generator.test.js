/*
 * Copyright IBM Corporation 2016
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

// Files which we assert are created each time the app generator is run.
var expected = [
  'Package.swift',
  '.swiftservergenerator-project'
];

describe('java generator integration test', function () {

  describe('Generates a rest project in headless mode, no configuration', function () {

    before(function () {
      // Mock the options, set up an output folder and run the generator
      return helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions({                       // Mock the prompt answers
          headless: true
        })
        .toPromise();                        // Get a Promise back when the generator finishes
    });



    it('should create a ', function () {
      assert.equal(path.basename(process.cwd()), 'notes');
    });
/*
    it('generates the expected application files', function () {
      assert.file(expected);
    });

    it('has the appname in the Package.swift file', function () {
      assert.fileContent('Package.swift', 'name: "notes"');
    });

    it('compiles the application', function () {
      assert.file(process.cwd()+'/.build/debug/notes');
    });
*/
  });
});
