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

class Options extends core.BxOptions {

  assert(appName, ymlName, cloudant, objectStorage) {
    super.assert(appName, ymlName, cloudant, objectStorage, 'bff');
    common.assertFiles('src', true, 'main/java/application/rest/SwaggerEndpoint.java',
                                    'main/java/application/model/Product.java',
                                    'main/java/application/openapi/ProductsApi.java',
                                    'main/java/application/openapi/ProductApi.java',
                                    'test/java/it/ProductsEndpointTest.java',
                                    'test/java/it/SwaggerEndpointTest.java');
  }

}



describe('java generator : bff integration test', function () {
  this.timeout(5000);

  describe('Generates a basic bff project (no bluemix), gradle build', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'gradle', createType: 'bff', services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert(core.APPNAME, core.APPNAME, false, false);
  });

  describe('Generates a basic bff project (no bluemix), maven build', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert(core.APPNAME, core.APPNAME, false, false);
  });

  describe('Generates a basic bff project (bluemix) with cloudant', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', services : ['cloudant'], appName : 'bxName', artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert('bxName', 'bxName', true, false);
    options.assertCloudant();
  });

  describe('Generates a basic bff project (bluemix) with Object Storage', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', services : ['objectStorage'], appName : 'bxName', artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert('bxName', 'bxName', false, true);
    options.assertObjectStorage();
  });

  describe('Generates a basic bff project (bluemix) with Cloudant and Object Storage', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', services : ['objectStorage','cloudant'], appName : 'bxName', artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert('bxName', 'bxName', true, true);
    options.assertCloudant();
    options.assertObjectStorage();
  });

});
