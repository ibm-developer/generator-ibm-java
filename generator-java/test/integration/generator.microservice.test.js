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
 * Tests the microservice generator
 */
'use strict';

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK = 'liberty';  //TODO alter to allow spring as well

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const common = require('../lib/test-common');
const kube = require('../lib/test-kube');

const framework = require('../lib/test-framework');
const tests = require('@arf/java-common');

function Options(buildType) {
  this.values = {
    headless :  "true",
    debug : "true",
    buildType : buildType,
    createType : 'microservice',
    appName : APPNAME,
    groupId : GROUPID,
    artifactId : ARTIFACTID,
    version : VERSION
  }
  this.assert = function(appName, ymlName, cloudant, objectStorage) {
    common.assertCommonFiles();
    common.assertCLI(appName);
    common.assertBluemixSrc(cloudant || objectStorage);
    common.assertManifestYml(ymlName, cloudant || objectStorage);
    common.assertCloudant(cloudant);
    common.assertObjectStorage(objectStorage);
    kube.test(appName, true);
    common.assertFiles('', true, 'README.md');
    framework.test(FRAMEWORK).assertCloudant(cloudant);
    framework.test(FRAMEWORK).assertObjectStorage(objectStorage);
    this.assertFramework(appName);
    this['assert' + FRAMEWORK]();
    this.assertBuild(appName);
  }
  this.assertBuild = function(appName) {
    var test = tests.test(this.values.buildType);
    test.assertApplication(appName, this.values.groupId, this.values.artifactId, this.values.version);
    test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    test.assertDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    test.assertDependency('provided', 'javax.enterprise', 'cdi-api', '1.2');
  }
  //general framework tests which apply to all of them
  this.assertFramework = function(appName) {
    framework.test(FRAMEWORK).assertFiles(appName);
    framework.test(FRAMEWORK).assertBuildFiles(this.values.buildType);
  }
  //Liberty specific framework tests
  this.assertliberty = function() {
    framework.test(FRAMEWORK).assertSourceFiles(false);
    framework.test(FRAMEWORK).assertFeatures('jaxrs-2.0');
    framework.test(FRAMEWORK).assertFeatures('jsonp-1.0');
    framework.test(FRAMEWORK).assertFeatures('jndi-1.0');
    framework.test(FRAMEWORK).assertFeatures('cdi-1.2');
  }
  this.assertCloudant = function() {
    it('has cloudant source files', function () {
      assert.fileContent('src/main/java/application/rest/v1/Example.java','Cloudant'); //check Cloudant service present
      assert.fileContent('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-cloudantNoSQLDB-000")');
      assert.fileContent('README.md', 'cloudant');
    });
    tests.test(this.values.buildType).assertDependency('compile', 'com.cloudant', 'cloudant-client', '2.7.0');
  }
  this.assertObjectStorage = function() {
    it('has Object Storage source files', function () {
      assert.fileContent('src/main/java/application/rest/v1/Example.java','OSClient'); //check object Storage service present
      assert.fileContent('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-Object-Storage-000")');
      assert.fileContent('README.md', 'Object Storage service');
    });
    tests.test(this.values.buildType).assertDependency('compile', 'org.pacesys', 'openstack4j-core', '3.0.3');
    tests.test(this.values.buildType).assertDependency('compile', 'org.pacesys.openstack4j.connectors', 'openstack4j-httpclient', '3.0.3');
  }
  this.before = function() {
    return helpers.run(path.join( __dirname, '../../generators/app'))
      .withOptions(this.values)
      .withPrompts({})
      .toPromise();
  }
}

describe('java generator : microservice integration test', function () {

  describe('Generates a basic microservices project (no bluemix), gradle build system', function () {
    var options = new Options('gradle');
    before(options.before.bind(options));
    options.assert(APPNAME, APPNAME, false, false);

    it('should create a basic microservice, gradle build system', function () {
      assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Some data");'); //check no bx services present
      assert.fileContent('README.md', 'gradle');
      assert.noFileContent('README.md', 'maven');
    });
  });

  describe('Generates a basic microservices project (no bluemix), maven build system', function () {
    var options = new Options('maven');
    before(options.before.bind(options));
    options.assert(APPNAME, APPNAME, false, false);

    it('should create a basic microservice, maven build system', function () {
      assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Some data");'); //check no bx services present
      assert.fileContent('README.md', 'maven');
      assert.noFileContent('README.md', 'gradle');
    });
  });

  describe('Generates a basic microservices project (bluemix)', function () {

    var options = new Options('gradle');
    options.values.bluemix = '{"name" : "bxName"}';
    before(options.before.bind(options));
    options.assert('bxName', 'bxName', false, false);

    it('with no services', function () {
      assert.noFileContent('src/main/java/application/rest/v1/Example.java', 'Cloudant');

      assert.fileContent('manifest.yml', 'name: bxName') //Not using prompt so we get app name and random route
      assert.fileContent('manifest.yml', 'random-route: true') //Not using prompt so we get app name and random route
      assert.noFileContent('README.md', 'cloudant');
    });
  });

  describe('Generates a basic microservices project (bluemix)', function () {

    var options = new Options('maven');
    options.values.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["cloudant"]}, "cloudant" : [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},"password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}]}';
    before(options.before.bind(options));

    options.assert('bxName', 'bxName', true, false);
    options.assertCloudant();
  });

  describe('Generates a basic microservices project (bluemix)', function () {

    var options = new Options('gradle');
    options.values.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["cloudant"]}, "cloudant" : [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},"password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}]}';
    before(options.before.bind(options));

    options.assert('bxName', 'bxName', true, false);
    options.assertCloudant();
  });

  describe('Generates a basic microservices project (bluemix)', function () {

    var options = new Options('maven');
    options.values.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["objectStorage"]}, "objectStorage" : [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},"project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password","auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}]}';
    before(options.before.bind(options));

    options.assert('bxName', 'bxName', false, true);
    options.assertObjectStorage();
  });

  describe('Generates a basic microservices project (bluemix)', function () {

    var options = new Options('gradle');
    options.values.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["objectStorage"]}, "objectStorage" : [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},"project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password","auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}]}';
    before(options.before.bind(options));

    options.assert('bxName', 'bxName', false, true);
    options.assertObjectStorage();
  });

});
