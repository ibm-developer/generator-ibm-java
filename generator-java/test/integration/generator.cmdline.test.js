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
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const common = require('../lib/test-common');

const tests = require('@arf/java-common');
const test = tests.test('gradle');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';


describe('java generator integration test', function () {

  describe('Generates a basic project in headless mode, using cmd line options', function () {

    before(function () {
      // Mock the options, set up an output folder and run the generator
      return helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions({                       // Mock the prompt answers
          headless: "true",
          debug: "true",
          buildType: 'gradle',
          createType: 'basic',
          version : VERSION,
          appName : APPNAME,
          groupId : GROUPID,
          artifactId : ARTIFACTID
        })
        .toPromise();                        // Get a Promise back when the generator finishes
    });

    test.assertApplication(APPNAME, GROUPID, ARTIFACTID, VERSION);

  });
});
