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
 const LIBERTY_CONFIG_FILE = 'src/main/liberty/config/server.xml';
 const LIBERTY_ENV_FILE = 'src/main/liberty/config/server.env';

function test_liberty() {
  assert.file(LIBERTY_CONFIG_FILE);
  assert.file(LIBERTY_ENV_FILE);
  assert.file('src/main/webapp/WEB-INF/ibm-web-ext.xml');
}

test_liberty.prototype.assertMavenFiles = function() {
  assertMavenProperty('testServerHttpPort', '9080');
  assertMavenProperty('testServerHttpsPort', '9443');
  assertMavenProperty('warContext', '${app.name}');
  assertMavenProperty('package.file', '${project.build.directory}/${app.name}.zip');
  assertMavenProperty('packaging.type', 'usr');
  assertMavenDependencies();
}

var assertMavenProperty = function(name, value) {
  assert.fileContent('pom.xml', '<' + name + '>' + value + '</' + name + '>');
}

var assertMavenDependencies = function() {
  assert.fileContent('pom.xml', /<groupId>junit<\/groupId>\s*<artifactId>junit<\/artifactId>\s*<version>4\.12<\/version>\s*<scope>test<\/scope>/);
  assert.fileContent('pom.xml', /<groupId>org\.apache\.cxf<\/groupId>\s*<artifactId>cxf-rt-rs-client<\/artifactId>\s*<version>3\.1\.1<\/version>\s*<scope>test<\/scope>/);
  assert.fileContent('pom.xml', /<groupId>org\.glassfish<\/groupId>\s*<artifactId>javax\.json<\/artifactId>\s*<version>1\.0\.4<\/version>\s*<scope>test<\/scope>/);
}

test_liberty.prototype.assertGradleFiles = function() {
  assertGradleProperty('testServerHttpPort', '9080');
  assertGradleProperty('testServerHttpsPort', '9443');
  assertGradleProperty('serverDirectory', '"${buildDir}/wlp/usr/servers/defaultServer"');
  assertGradleProperty('warContext', '"${appName}"');
  assertGradleProperty('packageFile', '"${project.buildDir}/${appName}.zip"');
  assertGradleProperty('packagingType', 'usr');
  assertGradleDependency('testCompile', 'junit', 'junit', '4.12');
  assertGradleDependency('testCompile', 'org.apache.cxf', 'cxf-rt-rs-client', '3.1.1');
  assertGradleDependency('testCompile', 'org.glassfish', 'javax.json', '1.0.4');
}

var assertGradleProperty = function(name, value) {
  assert.fileContent('build.gradle', name + ' = ' + value);
}

var assertGradleDependency = function(scope, groupId, artifactId, version) {
  assert.fileContent('build.gradle', scope + " '" + groupId + ':' + artifactId + ':' + version + "'");
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
