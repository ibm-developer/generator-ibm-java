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

//test the config module

var assert = require('assert');
var config = require('../../generators/app/lib/config');

var configDefaults = {};

var clone = function(from, to) {
  for (var prop in from) {
    if (from.hasOwnProperty(prop)) {
        to[prop] = new String(from[prop]);
    }
  }
}

before(function() {
  //record default values to restore for each test run
  clone(config.data, configDefaults);
})

beforeEach(function() {
  //make sure we start with a valid config object
  clone(configDefaults, config.data);
});

describe('Config defaults', function() {
  describe('default artifactId', function() {
    it('should be set to "artifactId" when the value has not been set', function(){
      assert.equal('artifactId', config.data.artifactId);
    });
  });
  describe('default grouptId', function() {
    it('should be set to "groupId" when the value has not been set', function(){
      assert.equal('groupId', config.data.groupId);
    });
  });
  describe('default name', function() {
    it('should be set to "myLibertyProject" when the value has not been set', function(){
      assert.equal('myLibertyProject', config.data.appName);
    });
  });
  describe('default build', function() {
    it('should be set to "maven" when the build type has not been set', function(){
      assert.equal('maven', config.data.buildType);
    });
  });
});


describe('Config validation', function() {
  describe('Missing name', function() {
    it('should not be valid when the name is either missing or an empty string', function(){
      config.data.appName = undefined;
      assert.equal(false, config.isValid());
      config.data.appName = '';
      assert.equal(false, config.isValid());
    });
  });
  describe('Invalid name', function() {
    it('should not be valid when the name contains invalid characters', function(){
      config.data.appName = "wibble%";
      assert.equal(false, config.isValid());
    });
  });
  describe('Name too long', function() {
    it('should not be valid when the name contains too many characters', function(){
      config.data.appName = "ThisIsAReallyLongNameButIsItLongEnoughNotQuiteSoLetsKeepGoing";
      assert.equal(false, config.isValid());
    });
  });
  describe('Invalid artifactId', function() {
    it('should not be valid when the artifactId contains invalid characters', function(){
      config.data.artifactId = "%wibble";
      assert.equal(false, config.isValid());
    });
  });
  describe('Invalid groupId', function() {
    it('should not be valid when the groupId contains invalid characters', function(){
      config.data.groupId = "%wibble";
      assert.equal(false, config.isValid());
    });
  });
});
