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
 const LIBERTY_VERSION = '17.0.0.1';   //current Liberty version to check for

function test_liberty() {
  assert.file('src/main/liberty/config/server.xml');
  assert.file('src/main/liberty/config/server.env');
  assert.file('src/main/webapp/WEB-INF/ibm-web-ext.xml');
}

test_liberty.prototype.assertMavenFiles = function() {
  assert.fileContent('pom.xml', '<testServerHttpPort>9080</testServerHttpPort>');
  assert.fileContent('pom.xml', '<testServerHttpsPort>9443</testServerHttpsPort>');
}

test_liberty.prototype.assertGradleFiles = function() {
  assert.fileContent('build.gradle', 'testServerHttpPort = 9080');
  assert.fileContent('build.gradle', 'testServerHttpsPort = 9443');
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
        check('src/main/liberty/config/server.xml', arguments[i].toLowerCase());
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
      check('src/main/liberty/config/server.env', arguments[i]);
    }
  }
}

module.exports = test_liberty;
