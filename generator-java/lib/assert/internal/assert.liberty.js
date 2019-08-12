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

'use strict'
const assert = require('yeoman-assert');
const liberty = require('../../../generators/liberty/exports');

const tests = require('../../../lib/common');

const assertLiberty = new liberty.integrationAsserts.liberty();

function test_liberty() {
}

test_liberty.prototype.assertSourceFiles = function(springSelected) {
  it('should contain Java code files common across all project types', function() {
    const check = springSelected ? assert.noFile : assert.file;
    check('src/main/java/application/HealthEndpoint.java');
    check('src/main/java/application/rest/JaxrsApplication.java');
    check('src/test/java/it/HealthEndpointIT.java');
  });
}

test_liberty.prototype.assertFiles = function() {
  assertLiberty.assertAllFiles(true);
  assertLiberty.assertContextRoot();
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

const assertMavenFiles = function() {
  assertLiberty.assertVersion('maven');
  tests.test('maven').assertProperty('package.file', '${project.build.directory}/${project.artifactId}-${project.version}.zip');
  tests.test('maven').assertProperty('packaging.type', 'usr');

}

const assertGradleFiles = function() {
  assertLiberty.assertVersion('gradle');
  tests.test('gradle').assertProperty('serverDirectory', '"${buildDir}/wlp/usr/servers/defaultServer"');
  tests.test('gradle').assertProperty('packageFile', '"${project.buildDir}/${rootProject.name}-${version}.zip"');
  tests.test('gradle').assertProperty('packagingType', "'usr'");
}

test_liberty.prototype.assertFeatures = function() {
  if(arguments.length < 1) {
    throw "assertFeatures error : requires at least 1 argument, a feature to check";
  }
  let i;
  let exists = true;
  if(typeof(arguments[0]) === "boolean") {
    exists = arguments[0];
    i = 1;
  } else {
    i = 0;
  }
  for(i; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      assertLiberty.assertFeature(exists, arguments[i]);
    }
  }
}

test_liberty.prototype.assertCloudant = function() {
  const jndi = {
    "cloudant/url" : "${env.cloudant_url}",
    "cloudant/username" : "${env.cloudant_username}",
    "cloudant/password" : "${env.cloudant_password}"
  }
  //no longer setting JNDI entries for Cloudant
  checkValues(false, jndi, assertLiberty.assertJNDI);

  const env = {
    cloudant_url : 'https://account.cloudant.com',
    cloudant_password : 'pass',
    cloudant_username : 'user'
  }
  //no longer setting variables in server.env for Cloudant
  checkValues(false, env, assertLiberty.assertEnv);
}

test_liberty.prototype.assertObjectStorage = function() {
  const jndi = {
    "objectstorage/auth_url" : "${env.object_storage_auth_url}",
    "objectstorage/userId" : "${env.object_storage_user_id}",
    "objectstorage/password" : "${env.object_storage_password}",
    "objectstorage/domainName" : "${env.object_storage_domainName}",
    "objectstorage/project" : "${env.object_storage_project}"
  }
  //no longer setting JNDI entries for Object Storage
  checkValues(false, jndi, assertLiberty.assertJNDI);

  const env = {
    object_storage_auth_url : 'objectStorage-url',
    object_storage_user_id : 'objectStorage-userId',
    object_storage_password : 'objectStorage-password',
    object_storage_domainName : 'objectStorage-domainName',
    object_storage_project : 'objectStorage-project'
  }
  //no longer setting variables in server.env for Object Storage
  checkValues(false, env, assertLiberty.assertEnv);
}

test_liberty.prototype.assertConfig = function(exists, tag) {
  return assertLiberty.assertConfig(exists, tag);
}

test_liberty.prototype.assertEnv = function(exists, env) {
  checkValues(exists, env, assertLiberty.assertEnv);
}

test_liberty.prototype.assertJndi = function(exists, jndi) {
  checkValues(exists, jndi, assertLiberty.assertJNDI);
}

//asserts that the specified environment variables will flow through JNDI
function checkValues(exists, object, func) {
  if(arguments.length < 2) {
    throw "check values error : requires at least 2 arguments, exists and an object to check";
  }
  for(let i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'object') {
      const entry = arguments[i];
      for (const prop in entry) {
        if (entry.hasOwnProperty(prop)) {
          func(exists, prop, entry[prop]);
        }
      }
    }
  }
}

module.exports = test_liberty;
