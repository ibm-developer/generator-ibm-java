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
 * Tests the basic generator
 */
'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const common = require('../lib/test-common');
const framework = require('../lib/test-framework');
const tests = require('@arf/java-common');
const command = tests.test('command');
const core = require('../lib/core');
const extend = require('extend');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK_LIBERTY = 'liberty';
const FRAMEWORK_SPRING = 'spring';

class Options extends core.BxOptions {
  constructor(runHeadless, buildType, frameworkType, name) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless : runHeadless.toString(),
      buildType : buildType,
      frameworkType : frameworkType,
      createType : 'basicweb/' + frameworkType,
      appName : name || core.APPNAME
    });
  }

  assert(appName, ymlName, cloudant, objectStorage, buildType, frameworkType) {
    super.assert(appName, ymlName, cloudant, objectStorage, 'basicweb/' + frameworkType);
    var base = this.values.frameworkType === FRAMEWORK_SPRING ? 'src/main/resources/static' : 'src/main/webapp';
    common.assertFiles(base, true, 'index.html', '/css/default.css', 'js/bundle.js');
    framework.test(frameworkType).assertSourceFiles(false);
    frameworkType === FRAMEWORK_LIBERTY ? this.assertliberty() : this.assertspring();
  }

  assertliberty() {
    super.assertliberty();
    var test = tests.test(this.values.buildType);
    test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('servlet-3.1');
  }

  assertspring() {
    super.assertspring();
    var test = tests.test(this.values.buildType);
    test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web');
    test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-actuator');
    test.assertDependency('test', 'org.springframework.boot', 'spring-boot-starter-test');
    it('should contain EndpointTest.java for testing the web endpoint', function() {
      assert.file('src/test/java/application/EndpointTest.java');
    });
  }

  assertCompiles(buildType) {
    command.run(tests.test(buildType).getCompileCommand());
  }

  assertCloudant(exists) {
    super.assertCloudant(exists);
    if(exists && (this.values.frameworkType === 'spring')) {
      it('should contain @Lazy for cloudant client', function() {
        assert.fileContent('src/main/java/application/cloudant/CloudantClientConfig.java', '@Lazy');
      });
    }
  }

  assertObjectStorage(exists) {
    super.assertObjectStorage(exists);
    if(exists && (this.values.frameworkType === 'spring')) {
      it('should contain @Lazy for ObjectStorage client', function() {
        assert.fileContent('src/main/java/application/objectstorage/ObjectStorageConfig.java', '@Lazy');
      });
    }
  }
}

var frameworkTypes = ['liberty', 'spring'];

describe('java generator : basic integration test', function () {
  this.timeout(7000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), gradle build with prompts', function () {
      var options = new Options(false, 'gradle', frameworkType);
      options.prompts = {extName : 'prompt:patterns', buildType : 'gradle', createType: 'basicweb/' + frameworkType, services: ['none'], appName: APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME, false, false, 'gradle', frameworkType);
    });

    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), maven build with prompts', function () {
      var options = new Options(false, 'maven', frameworkType);
      options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'basicweb/' + frameworkType, services: ['none'], appName: APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME, false, false, 'maven', frameworkType);
    });

    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), gradle build', function () {
      var options = new Options(true, 'gradle', frameworkType, APPNAME);
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME, false, false, 'gradle', frameworkType);
      options.assertCompiles('gradle');
    });

    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), maven build', function () {
      var options = new Options(true, 'maven', frameworkType, APPNAME);
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME, false, false, 'maven', frameworkType);
      options.assertCompiles('maven');
    });

    describe('Generates a basic ' + frameworkType + ' web project (bluemix) with cloudant', function () {
      var options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = core.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant'];
      options.values.bluemix.cloudant = core.BX_CLOUDANT;
      before(options.before.bind(options));
      options.assert('bxName', 'bxName', true, false, 'maven', frameworkType);
      options.assertCloudant(true);
      options.assertObjectStorage(false);
      options.assertCompiles('maven');
    });

    describe('Generates a basic ' + frameworkType + ' web project (bluemix) with Object Storage', function () {
      var options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = core.BX_SERVER;
      options.values.bluemix.server.services = ['objectStorage'];
      options.values.bluemix.objectStorage = core.BX_OBJECT_STORAGE;
      before(options.before.bind(options));
      options.assert('bxName', 'bxName', false, true, 'maven', frameworkType);
      options.assertCloudant(false);
      options.assertObjectStorage(true);
      options.assertCompiles('maven');
    });

    describe('Generates a basic ' + frameworkType + ' web project (bluemix) with Cloudant and Object Storage', function () {
      var options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = core.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant', 'objectStorage'];
      options.values.bluemix.cloudant = core.BX_CLOUDANT;
      options.values.bluemix.objectStorage = core.BX_OBJECT_STORAGE;
      before(options.before.bind(options));
      options.assert('bxName', 'bxName', true, true, 'maven', frameworkType);
      options.assertCloudant(true);
      options.assertObjectStorage(true);
    });

  });

});
