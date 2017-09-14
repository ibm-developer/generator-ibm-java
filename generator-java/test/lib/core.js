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
const kube = require('./test-kube');
const tests = require('@arf/java-common');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK_LIBERTY = 'liberty';
const BX_SERVER = {"host": "host", "domain": "mybluemix.net"};
const BX_CLOUDANT = [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},
  "password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}];
const BX_OBJECT_STORAGE = [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},
  "project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password",
  "auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}];

class Options {
 constructor() {
   this.values = {
     debug : "true",
     version : VERSION,
     groupId : GROUPID,
     artifactId : ARTIFACTID,
     bluemix : {
       backendPlatform : 'JAVA'
     }
   }
   this.prompts = {};
 }

 //handy function for checking both existence and non-existence
getCheck(exists) {
  return {
    file : exists ? assert.file : assert.noFile,
    desc : exists ? 'should create ' : 'should not create ',
    content : exists ? assert.fileContent : assert.noFileContent
  }
}

 assert(appName, ymlName, cloudant, objectStorage) {
   var name = this.values.frameworkType || FRAMEWORK_LIBERTY;
   common.assertCommonFiles(name);
   
   this.assertFramework(appName);
   this['assert' + name]();
   this.assertBuild(appName);
 }
 assertBuild(appName) {
   var test = tests.test(this.prompts.buildType || this.values.buildType);
   test.assertApplication(appName, GROUPID, ARTIFACTID, VERSION);
 }
 //general framework tests which apply to all of them
 assertFramework(appName) {
   var name = this.values.frameworkType || FRAMEWORK_LIBERTY;
   framework.test(name).assertFiles(appName);
   framework.test(name).assertBuildFiles(this.prompts.buildType || this.values.buildType);
 }
 assertliberty() {
   common.assertCommonLibertyFiles();
 }

assertspring() {
   common.assertCommonSpringFiles();
 }

 before() {
   return helpers.run(path.join( __dirname, '../../generators/app'))
     .inDir(path.join(__dirname, './tmp'))
     .withOptions(this.values)
     .withPrompts(this.prompts)
     .toPromise();
 }
}

//mlore advanced bluemix test options which expects source code etc.
class BxOptions extends Options {

 constructor(backendPlatform) {
   super();
   this.values.bluemix = {
       backendPlatform : backendPlatform || 'JAVA'
     }
 }

 assertCloudant(exists) {
   var check = this.getCheck(exists);
   it(check.desc + 'cloudant README entry', function () {
     if(exists) {
       check.content('README.md', 'cloudant');
     }
   });
   if(exists) {
     tests.test(this.prompts.buildType || this.values.buildType).assertDependency('compile', 'com.cloudant', 'cloudant-client', '2.7.0');
   }
 }
 assertObjectStorage(exists) {
   var check = this.getCheck(exists);
   it(check.desc + 'Object Storage README entry', function () {
     if(exists) {
       check.content('README.md', 'Object Storage service');
     }
   });
   if(exists) {
     tests.test(this.prompts.buildType || this.values.buildType).assertDependency('compile', 'org.pacesys', 'openstack4j-core', '3.0.3');
     tests.test(this.prompts.buildType || this.values.buildType).assertDependency('compile', 'org.pacesys.openstack4j.connectors', 'openstack4j-httpclient', '3.0.3');
   }
 }

  assert(appName, ymlName, cloudant, objectStorage, createType) {
    var name = this.values.frameworkType || FRAMEWORK_LIBERTY;
    super.assert(appName, ymlName, cloudant, objectStorage);
    common.assertCommonBxFiles();
    common.assertCLI(appName);
    (name === 'spring') ? common.assertBluemixSrcSvcEnabled(cloudant || objectStorage) : common.assertBluemixSrc(cloudant || objectStorage);
    common.assertManifestYml(ymlName, cloudant || objectStorage);
    kube.test(appName, true, name, createType);
    this.assertCloudant(cloudant);
    this.assertObjectStorage(objectStorage);

    framework.test(name).assertCloudant(cloudant);
    framework.test(name).assertObjectStorage(objectStorage);
  }

}

module.exports = {
 Options : Options,
 BxOptions : BxOptions,
 ARTIFACTID : ARTIFACTID,
 GROUPID : GROUPID,
 VERSION : VERSION,
 APPNAME : APPNAME,
 BX_SERVER : BX_SERVER,
 BX_CLOUDANT : BX_CLOUDANT,
 BX_OBJECT_STORAGE : BX_OBJECT_STORAGE
};
