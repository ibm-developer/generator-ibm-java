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
const assert = require('yeoman-assert');
const fs = require('fs');
const yml = require('js-yaml');
const TOOLCHAIN_YML = '.bluemix/toolchain.yml';
const CLI_CONFIG_YML = 'cli-config.yml';

const CLI_VERSION = '0.0.2';

function getCheck(exists) {
  return {
    file : exists ? assert.file : assert.noFile,
    desc : exists ? 'should create ' : 'should not create ',
    content : exists ? assert.fileContent : assert.noFileContent
  }
}

var assertCommonFiles = function(framework) {
  it('should create common files are present for all configurations', function () {
    assert.file('.gitignore');
    assert.file('Dockerfile');
    assert.file('.dockerignore');
    if(framework === 'liberty') {
      assert.fileContent('.dockerignore', 'defaultServer/logs');
      assert.fileContent('.dockerignore', 'defaultServer/workarea');
      assert.fileContent('Dockerfile', 'FROM websphere-liberty:webProfile7');
    }
    if(framework === 'spring') {
      assert.fileContent('Dockerfile', 'FROM ibmjava:8-sfj-alpine');
    }
  });
}

var assertCommonLibertyFiles = function() {
  it('should create common Liberty files are present for all configurations', function () {
    //add specific Liberty file checks
  });
}

var assertCommonSpringFiles = function() {
  it('should create common Spring files are present for all configurations', function () {
    //add specific Liberty file checks
  });
}

var assertCommonBxFiles = function() {
  it('should create common Bx files are present for all configurations', function () {
    //Docker files
    assert.file('Dockerfile-tools');
    assert.noFile('Dockerfile-run');//deprecated name
    // Bluemix files
    assert.file('manifest.yml');
    assert.file('.bluemix/deploy.json');
    assert.file('.bluemix/pipeline.yml');
    assert.file(TOOLCHAIN_YML);
    assert.file('manifests/kube.deploy.yml');
  });
}

//assert that the toolchain contains the bx enable specific commands
var assertToolchainBxEnable = function() {
  var data; 

  it('generates a cli-config.yml file', function () {
    assert.file(TOOLCHAIN_YML);
    data = yml.safeLoad(fs.readFileSync(TOOLCHAIN_YML, 'utf8'));
  });

  it('generates the correct value for repo.parameters.type', function() {
    var expectedValue = 'link';
    assert.strictEqual(data.repo.parameters.type, expectedValue, `type has wrong value '${data.repo.parameters.type}' it should be '${expectedValue}'`);
  });
}

//assert that the toolchain contains the bx create specific commands
var assertToolchainBxCreate = function() {
  var data; 

  it('generates a cli-config.yml file', function () {
    assert.file(TOOLCHAIN_YML);
    data = yml.safeLoad(fs.readFileSync(TOOLCHAIN_YML, 'utf8'));
  });

  it('generates the correct value for repo.parameters.type', function() {
    var expectedValue = 'clone';
    assert.strictEqual(data.repo.parameters.type, expectedValue, `type has wrong value '${data.repo.parameters.type}' it should be '${expectedValue}'`);
  });
}

//asserts that there are / are not source code files for bluemix
var assertBluemixSrc = function(exists) {
  var check = getCheck(exists);
  it(check.desc + 'source code files for bluemix using service enablement generator', function () {
    check.file('src/main/java/application/ibmcloud/CloudServicesException.java');
    check.file('src/main/java/application/ibmcloud/CloudServices.java');
  });
}

//asserts that any none of the supplied services are included in the dev-ops pipeline
var assertServices = function(exists) {
  if(arguments.length < 2) {
    throw "assertServices error : requires at least 2 arguments, base and a service to check";
  }
  var check = getCheck(exists);
  for(var i=1; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      var value = arguments[i];
      it(check.desc + 'configuration files for bluemix contains ' + value, function () {
        check.content('manifest.yml', value);
        check.content('.bluemix/pipeline.yml', value);
      });
    }
  }
}

//asserts that files required for the CLI are present and correct
var assertCLI = function(appname) {
  it('files required for the CLI are present and correct', function () {
    var check = getCheck(true);
    check.content(CLI_CONFIG_YML,'image-name-run : "' + appname.toLowerCase() + '"');  //make sure lowercase app name
    check.content(CLI_CONFIG_YML, 'version : ' + CLI_VERSION);
    check.content(CLI_CONFIG_YML, 'chart-path : "chart/' + appname.toLowerCase() + '"');
  });
}

//asserts all files exist relative to a given base location
var assertFiles = function(base, exists) {
  if(arguments.length < 3) {
    throw "assertFiles error : requires at least 3 arguments, base, exists and a file to check";
  }
  var check = getCheck(exists);
  for(var i=2; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      var name = arguments[i];
      it(check.desc + 'file ' + name, function () {
        check.file(path.join(base, name));
      });
    }
  }
}

//checks that Cloudant java files are either present (exists = true, or not exists = false)
var assertCloudantJava = function(exists) {
  var check = getCheck(exists);
  it(check.desc + 'Cloudant java files', function () {
    check.file('src/main/java/application/cloudant/Cloudant.java');
    check.file('src/main/java/application/cloudant/CloudantCredentials.java');
  });
}

//checks that Object Storage java files are either present (exists = true, or not exists = false)
var assertObjectStorageJava = function(exists) {
  var check = getCheck(exists);
  it(check.desc + 'Object Storage java files', function () {
    check.file('src/main/java/application/objectstorage/ObjectStorage.java');
    check.file('src/main/java/application/objectstorage/ObjectStorageCredentials.java');
  });
}

var assertManifestYml = function(ymlName, exists) {
  it('manifest yml contains application name ' + ymlName, function () {
    assert.fileContent('manifest.yml', 'name: ' + ymlName);
  });
  var check = getCheck(exists);
  it(check.desc + 'manifest yml service entries', function () {
    check.content('manifest.yml', 'services:');
    check.content('manifest.yml', 'host: host');
    check.content('manifest.yml', 'domain: mybluemix.net');
  });
}

var assertObjectStorage = function(exists) {
  var check = getCheck(exists);
  it(check.desc + 'manifest yml Object Storage entries', function () {
    check.content('manifest.yml', '- objectStorage', 'Object-Storage=config');
    check.content('manifest.yml', 'Object-Storage=config');
  });
  assertObjectStorageJava(exists);
  assertServices(exists, 'Object-Storage');
}

var assertCloudant = function(exists) {
  var check = getCheck(exists);
  it(check.desc + 'manifest yml Cloudant entries', function () {
    check.content('manifest.yml', '- cloudant', 'cloudantNoSQLDB=config');
    check.content('manifest.yml', 'cloudantNoSQLDB=config');
  });
  assertCloudantJava(exists);
  assertServices(exists, 'cloudant');
}

module.exports = {
  assertCommonFiles : assertCommonFiles,
  assertCommonBxFiles : assertCommonBxFiles,
  assertCommonLibertyFiles : assertCommonLibertyFiles,
  assertCommonSpringFiles : assertCommonSpringFiles,
  assertBluemixSrc : assertBluemixSrc,
  assertManifestYml : assertManifestYml,
  assertFiles : assertFiles,
  assertCLI : assertCLI,
  assertCloudantJava : assertCloudantJava,
  assertObjectStorageJava : assertObjectStorageJava,
  assertServices : assertServices,
  assertObjectStorage : assertObjectStorage,
  assertCloudant : assertCloudant,
  assertToolchainBxEnable : assertToolchainBxEnable,
  assertToolchainBxCreate : assertToolchainBxCreate
}
