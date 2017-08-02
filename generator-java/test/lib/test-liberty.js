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
const liberty = require('@arf/generator-liberty');
const tests = require('@arf/java-common');

const assertLiberty = new liberty.integrationAsserts.liberty();

function test_liberty() {
}

test_liberty.prototype.assertSourceFiles = function(springSelected) {
  it('should contain Java code files common across all project types', function() {
    var check = springSelected ? assert.noFile : assert.file;
    check('src/main/java/application/rest/HealthEndpoint.java');
    check('src/main/java/application/rest/JaxrsApplication.java');
    check('src/test/java/it/HealthEndpointIT.java');
  });
}

test_liberty.prototype.assertFiles = function(name) {
  assertLiberty.assertAllFiles(true);
  assertLiberty.assertContextRoot(name);
}

test_liberty.prototype.assertBuildFiles = function(buildType) {
  tests.test(buildType).assertProperty('testServerHttpPort', '9080');
  tests.test(buildType).assertProperty('testServerHttpsPort', '9443');
  tests.test(buildType).assertDependency('test', 'junit', 'junit', '4.12');
  tests.test(buildType).assertDependency('test', 'org.apache.cxf', 'cxf-rt-rs-client', '3.1.11');
  tests.test(buildType).assertDependency('test', 'org.glassfish', 'javax.json', '1.0.4');
  if(buildType === 'maven') {
    assertMavenFiles();
  }
  if(buildType === 'gradle') {
    assertGradleFiles();
  }
}

var assertMavenFiles = function() {
  assertLiberty.assertVersion('maven');
  tests.test('maven').assertProperty('warContext', '${app.name}');
  tests.test('maven').assertProperty('package.file', '${project.build.directory}/${app.name}.zip');
  tests.test('maven').assertProperty('packaging.type', 'usr');

}

var assertGradleFiles = function() {
  assertLiberty.assertVersion('gradle');
  tests.test('gradle').assertProperty('serverDirectory', '"${buildDir}/wlp/usr/servers/defaultServer"');
  tests.test('gradle').assertProperty('warContext', '"${appName}"');
  tests.test('gradle').assertProperty('packageFile', '"${project.buildDir}/${appName}.zip"');
  tests.test('gradle').assertProperty('packagingType', "'usr'");
}

test_liberty.prototype.assertFeatures = function() {
  if(arguments.length < 1) {
    throw "assertFeatures error : requires at least 1 argument, a feature to check";
  }
  var i;
  var check;
  var exists = true;
  if(typeof(arguments[0]) === "boolean") {
    exists = arguments[0];
    check = arguments[0] ? assert.fileContent : assert.noFileContent;
    i = 1;
  } else {
    check = assert.fileContent;
    i = 0;
  }
  for(i; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      assertLiberty.assertFeature(exists, arguments[i]);
    }
  }
}

test_liberty.prototype.assertCloudant = function(exists) {
  //assertLibertyConfig(exists, 'cloudant');
  var jndi = {
    "cloudant/url" : "${env.CLOUDANT_URL}",
    "cloudant/username" : "${env.CLOUDANT_USERNAME}",
    "cloudant/password" : "${env.CLOUDANT_PASSWORD}"
  }
  checkValues(exists, jndi, assertLiberty.assertJNDI);

  var env = {
    CLOUDANT_URL : 'https://account.cloudant.com',
    CLOUDANT_PASSWORD : 'pass',
    CLOUDANT_USERNAME : 'user'
  }
  checkValues(exists, env, assertLiberty.assertEnv);
}

test_liberty.prototype.assertObjectStorage = function(exists) {
  //assertLibertyConfig(exists, 'objectStorage');
  var jndi = {
    "objectstorage/auth_url" : "${env.OBJECTSTORAGE_AUTH_URL}",
    "objectstorage/userId" : "${env.OBJECTSTORAGE_USERID}",
    "objectstorage/password" : "${env.OBJECTSTORAGE_PASSWORD}",
    "objectstorage/domainName" : "${env.OBJECTSTORAGE_DOMAIN_NAME}",
    "objectstorage/project" : "${env.OBJECTSTORAGE_PROJECT}"
  }
  checkValues(exists, jndi, assertLiberty.assertJNDI);

  var env = {
    OBJECTSTORAGE_AUTH_URL : 'objectStorage-url',
    OBJECTSTORAGE_USERID : 'objectStorage-userId',
    OBJECTSTORAGE_PASSWORD : 'objectStorage-password',
    OBJECTSTORAGE_DOMAIN_NAME : 'objectStorage-domainName',
    OBJECTSTORAGE_PROJECT : 'objectStorage-project'
  }
  checkValues(exists, env, assertLiberty.assertEnv);
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

module.exports = test_liberty;
