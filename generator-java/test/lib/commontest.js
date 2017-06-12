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

//common test functions in a handy module

'use strict'
const path = require('path');
var assert = require('yeoman-assert');
const LIBERTY_VERSION = '17.0.0.1';   //current Liberty version to check for
const LIBERTY_FRAMEWORK = 'liberty';

var assertCommonFiles = function() {
  //check common files are present for all configurations
  assert.file('README.md');
  //Docker files
  assert.file('Dockerfile');
  assert.file('Dockerfile-tools');
  assert.noFile('Dockerfile-run');//deprecated name
  // Bluemix files
  assert.file('manifest.yml');
  assert.file('.bluemix/deploy.json');
  assert.file('.bluemix/pipeline.yml');
  assert.file('.bluemix/toolchain.yml');
  assert.file('manifests/kube.deploy.yml');
  // Liber8 files
  assert.file('Jenkinsfile');
  assert.file('.gitignore');
}

var assertGradleFiles = function(appname) {
  assert.noFile('pom.xml');   //build file
  assert.file('build.gradle');
  assert.file('settings.gradle');
  assert.fileContent('build.gradle',"appName = '" + appname +"'");
  assert.fileContent('build.gradle', 'wlp-webProfile7-' + LIBERTY_VERSION);
  assert.fileContent('manifest.yml', 'path: ./build/' + appname + '.zip');
}

var assertMavenFiles = function(appname) {
  assert.noFile('build.gradle');   //build file
  assert.noFile('settings.gradle');
  assert.file('pom.xml');
  assert.fileContent('pom.xml',"<app.name>" + appname +"</app.name>");
  assert.fileContent('pom.xml', '<version>' + LIBERTY_VERSION + '</version>');
  assert.fileContent('manifest.yml', 'path: ./target/' + appname + '.zip');
}

//asserts that there are no source code files for bluemix
var assertBluemixSrc = function(exists) {
  var check = exists ? assert.file : assert.noFile;
  check('src/main/java/application/bluemix/InvalidCredentialsException.java');
  check('src/main/java/application/bluemix/VCAPServices.java');
}

//asserts that any none of the supplied services are included in the dev-ops pipeline
var assertServices = function(exists) {
  if(arguments.length < 2) {
    throw "assertServices error : requires at least 2 arguments, base and a service to check";
  }
  var check = exists ? assert.fileContent : assert.noFileContent;
  for(var i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      check('manifest.yml', arguments[i]);
      check('.bluemix/pipeline.yml', arguments[i]);
    }
  }
}

//asserts that files required for the CLI are present and correct
var assertCLI = function(appname) {
  assert.fileContent('cli-config.yml','image-name-run : "' + appname.toLowerCase() + '"');  //make sure lowercase app name
  assert.fileContent('cli-config.yml', 'version : 0.0.2');
}

//asserts all files exist relative to a given base location
var assertFiles = function(base, exists) {
  if(arguments.length < 3) {
    throw "assertFiles error : requires at least 3 arguments, base, exists and a file to check";
  }
  var check = exists ? assert.file : assert.noFile;
  for(var i=2; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      check(path.join(base, arguments[i]));
    }
  }
}

//checks that Cloudant java files are either present (exists = true, or not exists = false)
var assertCloudantJava = function(exists) {
  var check = exists ? assert.file : assert.noFile;
  check('src/main/java/application/cloudant/Cloudant.java');
  check('src/main/java/application/cloudant/CloudantCredentials.java');
}

//checks that Object STorage java files are either present (exists = true, or not exists = false)
var assertObjectStorageJava = function(exists) {
  var check = exists ? assert.file : assert.noFile;
  check('src/main/java/application/objectstorage/ObjectStorage.java');
  check('src/main/java/application/objectstorage/ObjectStorageCredentials.java');
}

//assert that K8s specific files are present
var assertK8s = function(appname) {
  assert.fileContent('manifests/kube.deploy.yml', 'name: "' + appname + '-service"')
  assert.fileContent('Jenkinsfile', 'image = \''+ appname.toLowerCase() + '\'');
}

var assertManifestYml = function(ymlName, exists) {
  assert.fileContent('manifest.yml', 'name: ' + ymlName);
  var check = exists ? assert.fileContent : assert.noFileContent;
  check('manifest.yml', 'services:');
  check('manifest.yml', 'host: host');
  check('manifest.yml', 'domain: domain');
}

var assertObjectStorage = function(exists) {
  var check = exists ? assert.fileContent : assert.noFileContent;
  check('manifest.yml', '- objectStorage', 'Object-Storage=config');
  check('manifest.yml', 'Object-Storage=config');
  assertObjectStorageJava(exists);
  assertServices(exists, 'Object-Storage');
}

var assertCloudant = function(exists) {
  var check = exists ? assert.fileContent : assert.noFileContent;
  check('manifest.yml', '- cloudant', 'cloudantNoSQLDB=config');
  check('manifest.yml', 'cloudantNoSQLDB=config');
  assertCloudantJava(exists);
  assertServices(exists, 'cloudant');
}

module.exports = {
  assertCommonFiles : assertCommonFiles,
  assertGradleFiles : assertGradleFiles,
  assertMavenFiles : assertMavenFiles,
  assertBluemixSrc : assertBluemixSrc,
  assertManifestYml : assertManifestYml,
  assertFiles : assertFiles,
  assertCLI : assertCLI,
  assertCloudantJava : assertCloudantJava,
  assertObjectStorageJava : assertObjectStorageJava,
  assertServices : assertServices,
  assertK8s : assertK8s,
  assertObjectStorage : assertObjectStorage,
  assertCloudant : assertCloudant
}
