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

// test the defaults module

'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

beforeEach(function () {
  return helpers.run(path.join(__dirname, '../resources/defaults'));
});

describe('Defaults module', function () {
  describe('Call setOptions to expose the defaults as Yeoman options', function () {
    it('sets the defaults as options on the generator', function () {
      assert.fileContent('options.txt', 'appName=testName');
      assert.fileContent('options.txt', 'buildType=testBuildType');
    });
  });
});
