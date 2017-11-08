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

const AssertBFF = require('../../generators/lib/assert.bff');
const constant = require('../lib/constant');
const core = require('../lib/core');
const extend = require('extend');

class Options extends core.Options {
  constructor(runHeadless, buildType, frameworkType, name) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless: runHeadless.toString(),
      buildType: buildType,
      frameworkType: frameworkType,
      createType: 'bff/' + frameworkType,
      appName: name || constant.APPNAME
    });
  }
}

const frameworkTypes = [constant.FRAMEWORK_LIBERTY, constant.FRAMEWORK_SPRING];
const gradle = 'gradle';
const maven = 'maven';

describe('java generator : bff integration test', function () {
  this.timeout(25000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a basic bff project (no bluemix), gradle build with prompts', function () {
      const options = new Options(false, 'gradle', frameworkType);
      options.prompts = { extName: 'prompt:patterns', buildType: 'gradle', createType: 'bff/' + frameworkType, services: ['none'], appName: constant.APPNAME, artifactId: constant.ARTIFACTID, addbluemix: true, bluemix: options.values.bluemix };
      before(options.before.bind(options));

      const assert = new AssertBFF({
        appName: constant.APPNAME,
        buildType: gradle,
        createType: options.prompts.createType,
        cloudant: false,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
      assert.assert();
    });

    describe('Generates a basic bff project (no bluemix), maven build with prompts', function () {
      const options = new Options(false, 'maven', frameworkType);
      options.prompts = { extName: 'prompt:patterns', buildType: 'maven', createType: 'bff/' + frameworkType, services: ['none'], appName: constant.APPNAME, artifactId: constant.ARTIFACTID, addbluemix: true, bluemix: options.values.bluemix };
      before(options.before.bind(options));

      const assert = new AssertBFF({
        appName: constant.APPNAME,
        buildType: maven,
        createType: options.prompts.createType,
        cloudant: false,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
      assert.assert();
    });

    describe('Generates a basic bff project (no bluemix), gradle build', function () {
      const options = new Options(true, 'gradle', frameworkType, constant.APPNAME);
      before(options.before.bind(options));

      const assert = new AssertBFF({
        appName: constant.APPNAME,
        buildType: gradle,
        createType: options.prompts.createType,
        cloudant: false,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
      assert.assert();
      assert.assertCompiles();
    });

    describe('Generates a basic bff project (no bluemix), maven build', function () {
      const options = new Options(true, 'maven', frameworkType, constant.APPNAME);
      before(options.before.bind(options));

      const assert = new AssertBFF({
        appName: constant.APPNAME,
        buildType: maven,
        createType: options.prompts.createType,
        cloudant: false,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
      assert.assert();
      assert.assertCompiles();
    });

    describe('Generates a basic bff project (bluemix) with cloudant', function () {
      const options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant'];
      options.values.bluemix.cloudant = constant.BX_CLOUDANT;
      before(options.before.bind(options));

      const assert = new AssertBFF({
        appName: 'bxName',
        buildType: maven,
        createType: options.prompts.createType,
        cloudant: true,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: 'bxName'
      });
      assert.assert();
      assert.assertCloudant();
      assert.assertCompiles();
    });

    describe('Generates a basic bff project (bluemix) with Object Storage', function () {
      const options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['objectStorage'];
      options.values.bluemix.objectStorage = constant.BX_OBJECT_STORAGE;
      before(options.before.bind(options));

      const assert = new AssertBFF({
        appName: 'bxName',
        buildType: maven,
        createType: options.prompts.createType,
        cloudant: false,
        frameworkType: frameworkType,
        objectStorage: true,
        ymlName: 'bxName'
      });
      assert.assert();
      assert.assertObjectStorage();
      assert.assertCompiles();
    });

    describe('Generates a basic bff project (bluemix) with Cloudant and Object Storage', function () {
      const options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant', 'objectStorage'];
      options.values.bluemix.cloudant = constant.BX_CLOUDANT;
      options.values.bluemix.objectStorage = constant.BX_OBJECT_STORAGE;
      before(options.before.bind(options));

      const assert = new AssertBFF({
        appName: 'bxName',
        buildType: maven,
        createType: options.prompts.createType,
        cloudant: true,
        frameworkType: frameworkType,
        objectStorage: true,
        ymlName: 'bxName'
      });
      assert.assert();
      assert.assertCloudant();
      assert.assertObjectStorage();
    });
  });
});
