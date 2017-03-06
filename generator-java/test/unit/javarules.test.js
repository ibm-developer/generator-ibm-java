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

//test the java rules module

var assert = require('assert');
var rules = require('../../generators/lib/javarules');

describe('javarules library', function() {

  describe('can convert data types', function() {
    it('it should default unknown data types to Object', function(){
      assert.equal("Object", rules.dataType("wibble"));
    });

    it('it should default convert string to String', function(){
      assert.equal("String", rules.dataType("string"));
    });

    it('it should default convert integer to long', function(){
      assert.equal("long", rules.dataType("integer"));
    });
  });

  describe('can provide valid class names', function() {
    it('it should not change a valid class name', function(){
      assert.equal("MyTestClass", rules.className("MyTestClass"));
    });
    it('it should replace spaces with underscores', function(){
      assert.equal("My_Test_Class", rules.className("My Test Class"));
    });
    it('it should always capitalise the first letter of a class name', function(){
      assert.equal("MyTestClass", rules.className("myTestClass"));
    });
    it('it should return anonymous for a missing class name', function(){
      assert.equal("anonymous", rules.className(""));
    });
  });

  describe('can provide valid method names', function() {
    it('it should always lower case the first letter of a method name', function(){
      assert.equal("myTestMethod", rules.methodName("MyTestMethod"));
    });
    it('it should return anonymous for a missing method name', function(){
      assert.equal("anonymous", rules.methodName(""));
    });
  });

});
