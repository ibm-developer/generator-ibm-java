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
var assert = require('yeoman-assert');
var build = require('./test-build');

const LIBERTY_VERSION = '17.0.0.1';   //current Liberty version to check for
const LIBERTY_CONFIG_FILE = 'src/main/liberty/config/server.xml';
const LIBERTY_ENV_FILE = 'src/main/liberty/config/server.env';

function test_liberty() {
}

test_liberty.prototype.assertCommonFiles = function(springSelected) {
  it('should contain Liberty files common across all project types', function() {
    assert.file(LIBERTY_CONFIG_FILE);
    assert.file(LIBERTY_ENV_FILE);
    assert.file('src/main/webapp/WEB-INF/ibm-web-ext.xml');
    var check = springSelected ? assert.noFile : assert.file;
    check('src/main/java/application/rest/HealthEndpoint.java');
    check('src/main/java/application/rest/JaxrsApplication.java');
    check('src/test/java/it/HealthEndpointIT.java');
  });
}

test_liberty.prototype.assertBuildFiles = function(buildType) {
  build.test(buildType).assertProperty('testServerHttpPort', '9080');
  build.test(buildType).assertProperty('testServerHttpsPort', '9443');
  build.test(buildType).assertDependency('test', 'junit', 'junit', '4.12');
  build.test(buildType).assertDependency('test', 'org.apache.cxf', 'cxf-rt-rs-client', '3.1.1');
  build.test(buildType).assertDependency('test', 'org.glassfish', 'javax.json', '1.0.4');
  if(buildType === 'maven') {
    assertMavenFiles();
  }
  if(buildType === 'gradle') {
    assertGradleFiles();
  }
}

var assertMavenFiles = function() {
  build.test('maven').assertProperty('warContext', '${app.name}');
  build.test('maven').assertProperty('package.file', '${project.build.directory}/${app.name}.zip');
  build.test('maven').assertProperty('packaging.type', 'usr');

}

var assertGradleFiles = function() {
  build.test('gradle').assertContent('wlp-webProfile7-' + LIBERTY_VERSION);
  build.test('gradle').assertProperty('serverDirectory', '"${buildDir}/wlp/usr/servers/defaultServer"');
  build.test('gradle').assertProperty('warContext', '"${appName}"');
  build.test('gradle').assertProperty('packageFile', '"${project.buildDir}/${appName}.zip"');
  build.test('gradle').assertProperty('packagingType', "'usr'");
}

test_liberty.prototype.assertFeatures = function() {
  if(arguments.length < 1) {
    throw "assertFeatures error : requires at least 1 argument, a feature to check";
  }
  for(var i = 0; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      var feature = arguments[i];
      it('server.xml contains <feature>' + feature + '</feature>', function() {
        assert.fileContent(LIBERTY_CONFIG_FILE, "<feature>" + feature + "</feature>");
      });
    }
  }
}

test_liberty.prototype.assertCloudant = function(exists) {
  assertLibertyConfig(exists, 'cloudant');
  assertLibertyEnvVars(exists, 'CLOUDANT_URL="https://account.cloudant.com"', 'CLOUDANT_PASSWORD="pass"',
                          'CLOUDANT_USERNAME="user"');
}

test_liberty.prototype.assertObjectStorage = function(exists) {
  assertLibertyConfig(exists, 'objectStorage');
  assertLibertyEnvVars(exists, 'OBJECTSTORAGE_AUTH_URL="objectStorage-url"', 'OBJECTSTORAGE_USERID="objectStorage-userId"',
                        'OBJECTSTORAGE_PASSWORD="objectStorage-password"',
                        'OBJECTSTORAGE_DOMAIN_NAME="objectStorage-domainName"', 'OBJECTSTORAGE_PROJECT="objectStorage-project"');
}

var assertLibertyConfig = function(exists) {
  if(arguments.length < 2) {
    throw "assertLibertyConfig error : requires at least 2 arguments, base and a service to check";
  }
  var check = exists ? assert.fileContent : assert.noFileContent;
  for(var i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      if(exists) {
        check(LIBERTY_CONFIG_FILE, arguments[i].toLowerCase());
      }
    }
  }
}

//asserts that the specified environment variables will flow through JNDI
var assertLibertyEnvVars = function(exists) {
  if(arguments.length < 2) {
    throw "assertLibertyEnvVars error : requires at least 2 arguments, exists and a variable to check";
  }
  var check = exists ? assert.fileContent : assert.noFileContent;
  for(var i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      check(LIBERTY_ENV_FILE, arguments[i]);
    }
  }
}

module.exports = test_liberty;
