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

'use strict'
const path = require('path');
const assert = require('yeoman-assert');
const spring = require('@arf/generator-spring');
const tests = require('@arf/java-common');

const assertSpring = new spring.integrationAsserts.spring();

function test_spring() {
}

test_spring.prototype.assertSourceFiles = function(springSelected) {
  it('should contain Java code files common across all project types', function() {
    var check = springSelected ? assert.noFile : assert.file;
    check('src/main/java/application/rest/SBApplication.java');
    check('src/main/java/application/rest/HealthEndpoint.java');
  });
}

test_spring.prototype.assertFiles = function(name) {
  assertSpring.assertAllFiles(true);
}

test_spring.prototype.assertBuildFiles = function(buildType) {
  tests.test(buildType).assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web');
  tests.test(buildType).assertDependency('test', 'org.springframework.boot', 'spring-boot-starter-test');
  if(buildType === 'maven') {
    assertMavenFiles();
  }
  if(buildType === 'gradle') {
    assertGradleFiles();
  }
}

var assertMavenFiles = function() {
  assertSpring.assertVersion('maven');
  tests.test('maven').assertProperty('maven.compiler.source', '1.8');
  tests.test('maven').assertProperty('java.version', '1.8');

}

var assertGradleFiles = function() {
  assertSpring.assertVersion('gradle');
  tests.test('gradle').assertProperty('sourceCompatibility', '1.8');
  tests.test('gradle').assertProperty('targetCompatibility', '1.8');
}

test_spring.prototype.assertCloudant = function(exists) {
  var env = {
    cloudant_url : 'https://account.cloudant.com',
    cloudant_password : 'pass',
    cloudant_username : 'user'
  }
  checkValues(exists, env, assertSpring.assertEnv);
}

test_spring.prototype.assertObjectStorage = function(exists) {
  var env = {
    object_storage_authurl : 'objectStorage-url',
    object_storage_user_id : 'objectStorage-userId',
    object_storage_password : 'objectStorage-password',
    object_storage_domainName : 'objectStorage-domainName',
    object_storage_project : 'objectStorage-project'
  }
  checkValues(exists, env, assertSpring.assertEnv);
}

//asserts that the specified environment variables will flow through JNDI
function checkValues(exists, object, func) {
  if(arguments.length < 2) {
    throw "check values error : requires at least 2 arguments, exists and an object to check";
  }
  for(var i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'object') {
      var entry = arguments[i];
      for (var prop in entry) {
        if (entry.hasOwnProperty(prop)) {
          func(exists, prop, entry[prop]);
        }
      }
    }
  }
}

module.exports = test_spring;
