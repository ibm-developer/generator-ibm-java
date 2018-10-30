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
const assert = require('assert');
const Defaults = require('../resources/defaults/defaults.js');

const defaults = new Defaults();

describe('Defaults module', function() {
  describe('Call getObject to get the default object', function() {
    let appName = defaults.getObject('appName');
    let buildType = defaults.getObject('buildType');
    it('can get the default value', function() {
      assert.equal(appName.default, 'testName');
      assert.equal(buildType.default, 'testBuildType');
    });
    it('can get the description', function() {
      assert.equal(appName.desc, 'Name of the application');
      assert.equal(buildType.desc, 'Build system to use');
    });
    it('can get the type', function() {
      assert.equal(appName.type, String);
      assert.equal(buildType.type, String);
    });
  });
  it('can use get(<name>) to get the default value for name', function() {
    assert.equal(defaults.get('appName'), 'testName');
    assert.equal(defaults.get('buildType'), 'testBuildType');
  });
  describe('Call get() to get a list of config values with defaults', function() {
    let defaultValues = defaults.get();
    let foundAppName = false;
    let foundBuildType = false;
    for(let i = 0; i < defaultValues.length; i++) {
      if(defaultValues[i] === 'appName') {
        foundAppName = true;
      }
      if(defaultValues[i] === 'buildType') {
        foundBuildType = true;
      }
    }
    it('finds appName in the list of config values with defaults', function() {
      assert(foundAppName);
    });
    it('finds buildType in the list of config values with defaults', function() {
      assert(foundBuildType);
    });
  });
  describe('Call setOptions sets the defaults on the generator options', function() {
    let options = {}
    let generator = {option: function(key, object) {
      options[key] = object
    }}
    defaults.setOptions(generator)
    it('sets appName on generator with correct default value', function() {
      assert.equal(options.appName.default, 'testName')
      assert.equal(options.appName.desc, 'Name of the application')
    })
    it('sets buildType on generator with correct default value', function() {
      assert.equal(options.buildType.default, 'testBuildType')
      assert.equal(options.buildType.desc, 'Build system to use')
    })
  });
})
