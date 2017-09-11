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
const core = require('../lib/core');
const extend = require('extend');

const FRAMEWORK_LIBERTY = 'liberty';

class Options extends core.BxOptions {
  constructor(runHeadless, buildType, frameworkType, name) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless : runHeadless.toString(),
      buildType : buildType,
      frameworkType : frameworkType,
      createType : 'bff/' + frameworkType,
      appName : name || core.APPNAME
    });
  }


  assert(appName, ymlName, cloudant, objectStorage, buildType, frameworkType) {
    super.assert(appName, ymlName, cloudant, objectStorage, 'bff');
    common.assertFiles('src', true, 'main/java/application/rest/SwaggerEndpoint.java',
                                    'main/java/application/model/Product.java',
                                    'main/java/application/openapi/ProductsApi.java',
                                    'main/java/application/openapi/ProductApi.java',
                                    'test/java/it/ProductsEndpointTest.java',
                                    'test/java/it/SwaggerEndpointTest.java');
    framework.test(frameworkType).assertSourceFiles(false);
    frameworkType === FRAMEWORK_LIBERTY ? this.assertliberty() : this.assertspring();
    if(buildType === 'maven') {
      tests.test(buildType).assertContent('<feature>apiDiscovery-1.0</feature>');
    }
    if(buildType === 'gradle') {
      tests.test(buildType).assertContent("name = ['apiDiscovery-1.0']");
    }
  }

  assertliberty() {
    super.assertliberty();
    var test = tests.test(this.values.buildType);
    test.assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
    test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('apiDiscovery-1.0');
  }

  assertSpring() {
    super.assertSpring();
  }

}

var frameworkTypes = ['liberty'];

describe('java generator : bff integration test', function () {
  this.timeout(7000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a basic bff project (no bluemix), gradle build with prompts', function () {
      var options = new Options(false, 'gradle', frameworkType);
      options.prompts = {extName : 'prompt:patterns', buildType : 'gradle', createType: 'bff/' + frameworkType, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, false, false, 'gradle', frameworkType);
    });

    describe('Generates a basic bff project (no bluemix), maven build with prompts', function () {
      var options = new Options(false, 'maven', frameworkType);
      options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'bff/' + frameworkType, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, false, false, 'maven', frameworkType);
    });

    describe('Generates a basic bff project (no bluemix), gradle build', function () {
      var options = new Options(true, 'gradle', frameworkType, core.APPNAME);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, false, false, 'gradle', frameworkType);
    });

    describe('Generates a basic bff project (no bluemix), maven build', function () {
      var options = new Options(true, 'maven', frameworkType, core.APPNAME);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, false, false, 'maven', frameworkType);
    });

    describe('Generates a basic bff project (bluemix) with cloudant', function () {
      var options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = core.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant'];
      options.values.bluemix.cloudant = core.BX_CLOUDANT;
      before(options.before.bind(options));
      options.assert('bxName', 'bxName', true, false, 'maven', frameworkType);
      options.assertCloudant();
    });

    describe('Generates a basic bff project (bluemix) with Object Storage', function () {
      var options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = core.BX_SERVER;
      options.values.bluemix.server.services = ['objectStorage'];
      options.values.bluemix.objectStorage = core.BX_OBJECT_STORAGE;
      before(options.before.bind(options));
      options.assert('bxName', 'bxName', false, true, 'maven', frameworkType);
      options.assertObjectStorage();
    });

    describe('Generates a basic bff project (bluemix) with Cloudant and Object Storage', function () {
      var options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = core.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant', 'objectStorage'];
      options.values.bluemix.cloudant = core.BX_CLOUDANT;
      options.values.bluemix.objectStorage = core.BX_OBJECT_STORAGE;
      before(options.before.bind(options));
      options.assert('bxName', 'bxName', true, true, 'maven', frameworkType);
      options.assertCloudant();
      options.assertObjectStorage();
    });
  });
});
