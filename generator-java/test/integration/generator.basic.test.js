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
const core = require('../lib/core');
const common = require('../lib/test-common');

class Options extends core.Options {

  assert(appName, ymlName, cloudant, objectStorage) {
    super.assert(appName, ymlName, cloudant, objectStorage);
    common.assertFiles('src', false, 'main/java/application/api/v1/HealthEndpoint.java',
                                     'test/java/it/HealthEndpointIT.java')
  }
}

describe('java generator : basic integration test', function () {

  describe('Generates a basic project (no bluemix), gradle build', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'gradle', createType: 'basic', services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert(core.APPNAME, core.APPNAME, false, false);
  });

  describe('Generates a basic  project (no bluemix), maven build', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'basic', services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert(core.APPNAME, core.APPNAME, false, false);
  });

  describe('Generates a basic  project (bluemix) with cloudant', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'basic', services : ['cloudant'], appName : 'bxName', artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert('bxName', 'bxName', true, false);
  });

  describe('Generates a basic  project (bluemix) with Object Storage', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'basic', services : ['objectStorage'], appName : 'bxName', artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert('bxName', 'bxName', false, true);
  });

  describe('Generates a basic  project (bluemix) with Cloudant and Object Storage', function () {
    var options = new Options();
    options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'basic', services : ['objectStorage','cloudant'], appName : 'bxName', artifactId: core.ARTIFACTID};
    before(options.before.bind(options));
    options.assert('bxName', 'bxName', true, true);
  });

});
