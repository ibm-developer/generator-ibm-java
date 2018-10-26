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
const Defaults = require('../../lib/defaults');

const defaults = new Defaults();

describe('Defaults module', function() {

  describe('Technologies default type is an array', function() {
    const technologiesType = defaults.getObject('technologies').type;
    it('returns technologies as an array when passed an array', function() {
      const array = ["foo", "bar"];
      const newArray = technologiesType(array);
      assert(Array.isArray(newArray));
      assert.equal(newArray.length, 2);
      assert.equal(newArray[0], "foo");
      assert.equal(newArray[1], "bar");
    });
    it('returns technologies as an array when passed a comma separated string', function() {
      const string = "foo,bar";
      const array = technologiesType(string);
      assert(Array.isArray(array));
      assert.equal(array.length, 2);
      assert.equal(array[0], "foo");
      assert.equal(array[1], "bar");
    });
  });
})
