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
var config = require('../../generators/lib/config');

beforeEach(function() {
  //make sure we start with a valid config object
  config.reset();
});

describe('Config behaviour', function() {
  it('should be possible to rest config values', function(){
    config.data.artifactId = 'testID';
    config.data.bluemix = {name : 'bxName'};
    config.reset();
    assert.equal('artifactId', config.data.artifactId);
    assert.equal(undefined, config.data.bluemix);
  });
});

describe('Config defaults', function() {
  it('artifactId should be set to "artifactId" when the value has not been set', function(){
    assert.equal('artifactId', config.data.artifactId);
  });
  it('groupId should be set to "groupId" when the value has not been set', function(){
    assert.equal('groupId', config.data.groupId);
  });
  it('name should be set to "myLibertyProject" when the value has not been set', function(){
    assert.equal('myLibertyProject', config.data.appName);
  });
  it('build should be set to "maven" when the build type has not been set', function(){
    assert.equal('maven', config.data.buildType);
  });
});


describe('Config validation', function() {
  it('should not be valid when the name contains invalid characters', function(){
    assert.equal(true, config.isValid());
  });
  it('should not be valid when the name is either missing or an empty string', function(){
    config.data.appName = undefined;
    assert.equal(false, config.isValid());
    config.data.appName = '';
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the name contains invalid characters', function(){
    config.data.appName = "wibble%";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the name contains too many characters', function(){
    config.data.appName = "ThisIsAReallyLongNameButIsItLongEnoughNotQuiteSoLetsKeepGoing";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the artifactId contains invalid characters', function(){
    config.data.artifactId = "%wibble";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the groupId contains invalid characters', function(){
    config.data.groupId = "%wibble";
    assert.equal(false, config.isValid());
  });
});
