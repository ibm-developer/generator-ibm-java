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
const openApi = new liberty.integrationAsserts.openapi();

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

test_liberty.prototype.assertJavaMetrics = function(exists, buildType) {
  assertLiberty.assertJavaMetrics(exists, buildType);
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
  var jndi = {
    "cloudant/url" : "${env.cloudant_url}",
    "cloudant/username" : "${env.cloudant_username}",
    "cloudant/password" : "${env.cloudant_password}"
  }
  checkValues(exists, jndi, assertLiberty.assertJNDI);

  var env = {
    cloudant_url : 'https://account.cloudant.com',
    cloudant_password : 'pass',
    cloudant_username : 'user'
  }
  checkValues(exists, env, assertLiberty.assertEnv);
}

test_liberty.prototype.assertObjectStorage = function(exists) {
  var jndi = {
    "objectstorage/auth_url" : "${env.object_storage_authurl}",
    "objectstorage/userId" : "${env.object_storage_user_id}",
    "objectstorage/password" : "${env.object_storage_password}",
    "objectstorage/domainName" : "${env.object_storage_domainName}",
    "objectstorage/project" : "${env.object_storage_project}"
  }
  checkValues(exists, jndi, assertLiberty.assertJNDI);

  var env = {
    object_storage_authurl : 'objectStorage-url',
    object_storage_user_id : 'objectStorage-userId',
    object_storage_password : 'objectStorage-password',
    object_storage_domainName : 'objectStorage-domainName',
    object_storage_project : 'objectStorage-project'
  }
  checkValues(exists, env, assertLiberty.assertEnv);
}

test_liberty.prototype.assertOpenApi = function(exists, fileNames, buildType) {
  openApi.assert(exists, fileNames);
  var check = exists ? tests.test(buildType).assertContent : tests.test(buildType).assertNoContent;
  if(buildType === 'maven') {
    check('<feature>apiDiscovery-1.0</feature>')
  }
  if(buildType === 'gradle') {
    check("name = ['apiDiscovery-1.0']");
  }
}

test_liberty.prototype.getExampleOpenApi = function() {
  return openApi.getExample();
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
