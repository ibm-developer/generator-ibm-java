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

// test the defaults module

var assert = require('assert');
var defaults = require('../../generators/lib/defaults');

describe('Defaults module', function() {
  describe('Call getDefault to get the default object', function() {
    var appName = defaults.getObject('appName');
    var buildType = defaults.getObject('buildType');
    it('can get the default value', function() {
      assert.equal(appName.default, 'LibertyProject');
      assert.equal(buildType.default, 'maven');
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
  it('can use getDefaultValue to get the default value', function() {
    assert.equal(defaults.get('appName'), 'LibertyProject');
    assert.equal(defaults.get('buildType'), 'maven');
  });
  describe('Call getDefaults to get a list of config values with defaults', function() {
    var defaultValues = defaults.get();
    var foundAppName = false;
    var foundBuildType = false;
    for(var i = 0; i < defaultValues.length; i++) {
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
  describe('Bluemix default type is a function', function() {
    var bluemixType = defaults.getObject('bluemix').type;
    it('returns a function', function() {
      assert.equal(typeof bluemixType, 'function');
    });
    it('returns a function which returns a JSON object when passed a string', function() {
      var string = '{"name":"bob"}';
      var json = bluemixType(string);
      assert.equal(typeof json, 'object');
      assert.equal(json.name, 'bob');
    });
    it('returns a function which returns a JSON object when passed an object', function() {
      var object = JSON.parse('{"name":"bob"}');
      var json = bluemixType(object);
      assert.equal(typeof json, 'object');
      assert.equal(json.name, 'bob');
    });
  });
})
