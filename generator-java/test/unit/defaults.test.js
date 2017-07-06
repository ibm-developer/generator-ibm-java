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

const assert = require('assert');
const Defaults = require('../../generators/lib/defaults');

var defaults = new Defaults();

describe('Defaults module', function() {
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
    it('throws an exception when an object that is not a String or Object is passed', function() {
      var array = ['foo', 'bar'];
      assert.throws(() => {bluemixType(array)}, /bluemixToObject expects an Object or a String, got \["foo","bar"\]/, 'Did not throw an exception for passing an incorrect parameter');
    });
  });
})
