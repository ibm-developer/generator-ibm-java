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

/**
 * core classes for tests
 */

'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const common = require('./test-common');
const framework = require('./test-framework');
const tests = require('@arf/java-common');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK = 'liberty';

//handy function for checking both existence and non-existence
function getCheck(exists) {
  return {
    file : exists ? assert.file : assert.noFile,
    desc : exists ? 'should create ' : 'should not create ',
    content : exists ? assert.fileContent : assert.noFileContent
  }
}

class Options {
 constructor() {
   this.values = {
     debug : "true",
     version : VERSION,
     groupId : GROUPID
   }
   this.prompts = {};
 }

 assert(appName, ymlName, cloudant, objectStorage) {
   common.assertCommonFiles();
   common.assertCLI(appName);
   common.assertBluemixSrc(cloudant || objectStorage);
   common.assertManifestYml(ymlName, cloudant || objectStorage);
   common.assertCloudant(cloudant);
   common.assertObjectStorage(objectStorage);
   common.assertK8s(appName);

   framework.test(FRAMEWORK).assertCloudant(cloudant);
   framework.test(FRAMEWORK).assertObjectStorage(objectStorage);
   this.assertFramework(appName);
   this['assert' + FRAMEWORK]();
   this.assertBuild(appName);
 }
 assertBuild(appName) {
   var test = tests.test(this.prompts.buildType || this.values.buildType);
   test.assertApplication(appName, GROUPID, ARTIFACTID, VERSION);
 }
 //general framework tests which apply to all of them
 assertFramework(appName) {
   framework.test(FRAMEWORK).assertFiles(appName);
   framework.test(FRAMEWORK).assertBuildFiles(this.prompts.buildType || this.values.buildType);
 }
 assertliberty() {
   //do nothing by default, add specific feature checks here
 }
 assertCloudant(exists) {
   var check = getCheck(exists);
   it(check.desc + 'cloudant README entry', function () {
     if(exists) {
       check.content('README.md', 'cloudant');
     }
   });
   it(check.desc + 'cloudant source files', function () {
     if(exists) {
       check.content('src/main/java/application/rest/v1/Example.java','Cloudant'); //check Cloudant service present
       check.content('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-cloudantNoSQLDB-000")');
     }
   });
   if(exists) {
     tests.test(this.prompts.buildType || this.values.buildType).assertDependency('compile', 'com.cloudant', 'cloudant-client', '2.7.0');
   }
 }
 assertObjectStorage(exists) {
   var check = getCheck(exists);
   it(check.desc + 'Object Storage README entry', function () {
     if(exists) {
       check.content('README.md', 'Object Storage service');
     }
   });
   it(check.desc + 'Object Storage source files', function () {
     if(exists) {
       check.content('src/main/java/application/rest/v1/Example.java','OSClient'); //check object Storage service present
       check.content('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-Object-Storage-000")');
     }
   });
   if(exists) {
     tests.test(this.prompts.buildType || this.values.buildType).assertDependency('compile', 'org.pacesys', 'openstack4j-core', '3.0.3');
     tests.test(this.prompts.buildType || this.values.buildType).assertDependency('compile', 'org.pacesys.openstack4j.connectors', 'openstack4j-httpclient', '3.0.3');
   }
 }

 before() {
   return helpers.run(path.join( __dirname, '../../generators/app'))
     .withOptions(this.values)
     .withPrompts(this.prompts)
     .toPromise();
 }
}

//mlore advanced bluemix test options which expects source code etc.
class BxOptions extends Options {
  assert(appName, ymlName, cloudant, objectStorage) {
    super.assert(appName, ymlName, cloudant, objectStorage);
    super.assertCloudant(cloudant);
    super.assertObjectStorage(objectStorage);
  }

}

module.exports = {
 Options : Options,
 BxOptions : BxOptions,
 ARTIFACTID : ARTIFACTID,
 GROUPID : GROUPID,
 VERSION : VERSION,
 APPNAME : APPNAME,
 FRAMEWORK : FRAMEWORK
};
