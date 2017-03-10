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

var assert = require('yeoman-assert');
var path = require('path');

var assertCommonFiles = function() {
  //check common files are present for all configurations
  assert.file('src/main/liberty/config/server.xml');    //liberty configuration
  assert.file('src/main/liberty/config/server.env');
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
  assert.file('kube.deploy.yml');
  // Liber8 files
  assert.file('Jenkinsfile');
}

var assertGradleFiles = function(appname) {
  assert.noFile('pom.xml');   //build file
  assert.file('build.gradle');
  assert.fileContent('build.gradle',"appName = '" + appname +"'");
  assert.fileContent('Jenkinsfile',"utils.dockerBuild('" + appname + "')");
}

var assertMavenFiles = function(appname) {
  assert.noFile('build.gradle');   //build file
  assert.file('pom.xml');
  assert.fileContent('pom.xml',"<app.name>" + appname +"</app.name>");
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
      assert.noFileContent('.bluemix/pipeline.yml', arguments[i]);
      if(exists) {
        //check('src/main/liberty/config/server.xml', arguments[i]);
      }
    }
  }
}

//asserts that files required for the CLI are present and correct
var assertCLI = function(appname) {
  assert.fileContent('cli-config.yml','image-name-run : "bx-dev-' + appname.toLowerCase() + '"');  //make sure lowercase app name
}

//asserts all files exist relative to a given base location
var assertFiles = function(base) {
  if(arguments.length < 2) {
    throw "assertFiles error : requires at least 2 arguments, base and a file to check";
  }
  for(var i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      assert.file(path.join(base, arguments[i]));
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

//asserts that the specified environment variables will flow through JNDI
var assertEnvVars = function(exists) {
  if(arguments.length < 2) {
    throw "assertEnvVars error : requires at least 2 arguments, exists and a variable to check";
  }
  var check = exists ? assert.fileContent : assert.noFileContent;
  for(var i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      check('src/main/liberty/config/server.env', arguments[i]);
    }
  }
}

//assert that Liber8 specific files are present
var assertLiber8 = function(appname) {
  assert.fileContent('Jenkinsfile',"utils.dockerBuild('" + appname + "')");
}

var assertObjectStorage = function(ymlName, exists) {
  assert.fileContent('manifest.yml', 'name: ' + ymlName, 'host: host', 'domain: domain', 'services:');
  var check = exists ? assert.fileContent : assert.noFileContent;
  check('manifest.yml', '- objectStorage', 'Object-Storage=config');
  assertObjectStorageJava(exists);
  assertServices(exists, 'objectStorage');
}

var assertCloudant = function(ymlName, exists) {
  assert.fileContent('manifest.yml', 'name: ' + ymlName, 'host: host', 'domain: domain', 'services:');
  var check = exists ? assert.fileContent : assert.noFileContent;
  check('manifest.yml', '- cloudant', 'cloudantNoSQLDB=config');
  assertCloudantJava(exists);
  assertServices(exists, 'cloudant');
  assertEnvVars(exists, 'CLOUDANT_URL=https://account.cloudant.com', 'CLOUDANT_PASSWORD=pass', 'CLOUDANT_USERNAME=user');
}

module.exports = {
  assertCommonFiles : assertCommonFiles,
  assertGradleFiles : assertGradleFiles,
  assertMavenFiles : assertMavenFiles,
  assertBluemixSrc: assertBluemixSrc,
  assertFiles : assertFiles,
  assertCLI : assertCLI,
  assertCloudantJava : assertCloudantJava,
  assertObjectStorageJava : assertObjectStorageJava,
  assertServices : assertServices,
  assertEnvVars : assertEnvVars,
  assertLiber8 : assertLiber8,
  assertObjectStorage : assertObjectStorage,
  assertCloudant : assertCloudant
}
