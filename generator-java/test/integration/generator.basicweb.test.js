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

'use strict';

const AssertBasicWeb = require('../../generators/lib/assert.basicweb');
const constant = require('../lib/constant');
const core = require('../lib/core');
const extend = require('extend');
const framework = require('../lib/test-framework');

class Options extends core.BxOptions {
  constructor(runHeadless, buildType, frameworkType, name) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless: runHeadless.toString(),
      buildType: buildType,
      frameworkType: frameworkType,
      createType: 'basicweb/' + frameworkType,
      appName: name || constant.APPNAME
    });
  }
}

const frameworkTypes = [constant.FRAMEWORK_LIBERTY, constant.FRAMEWORK_SPRING];
const gradle = 'gradle';
const maven = 'maven';

describe('java generator : basic integration test', function () {
  this.timeout(7000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), gradle build with prompts', function () {
      const options = new Options(false, 'gradle', frameworkType);
      options.prompts = { extName: 'prompt:patterns', buildType: 'gradle', createType: 'basicweb/' + frameworkType, services: ['none'], appName: constant.APPNAME, artifactId: constant.ARTIFACTID };
      before(options.before.bind(options));

      const assert = new AssertBasicWeb(frameworkType);
      assert.assert({
        appName: constant.APPNAME,
        buildType: gradle,
        cloudant: false,
        createType: options.prompts.createType,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
    });

    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), maven build with prompts', function () {
      const options = new Options(false, 'maven', frameworkType);
      options.prompts = { extName: 'prompt:patterns', buildType: 'maven', createType: 'basicweb/' + frameworkType, services: ['none'], appName: constant.APPNAME, artifactId: constant.ARTIFACTID };
      before(options.before.bind(options));

      const assert = new AssertBasicWeb(frameworkType);
      assert.assert({
        appName: constant.APPNAME,
        buildType: maven,
        cloudant: false,
        createType: options.prompts.createType,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
    });

    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), gradle build', function () {
      const options = new Options(true, 'gradle', frameworkType, constant.APPNAME);
      before(options.before.bind(options));

      const assert = new AssertBasicWeb(frameworkType);
      assert.assert({
        appName: constant.APPNAME,
        buildType: gradle,
        cloudant: false,
        createType: options.prompts.createType,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
      assert.assertCompiles(gradle);
    });

    describe('Generates a basic ' + frameworkType + ' web project (no bluemix), maven build', function () {
      const options = new Options(true, 'maven', frameworkType, constant.APPNAME);
      before(options.before.bind(options));

      const assert = new AssertBasicWeb(frameworkType);
      assert.assert({
        appName: constant.APPNAME,
        buildType: maven,
        cloudant: false,
        createType: options.prompts.createType,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: constant.APPNAME
      });
      assert.assertCompiles(maven);
    });

    describe('Generates a basic ' + frameworkType + ' web project (bluemix) with cloudant', function () {
      const options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant'];
      options.values.bluemix.cloudant = constant.BX_CLOUDANT;
      before(options.before.bind(options));

      const assert = new AssertBasicWeb(frameworkType);
      assert.assert({
        appName: 'bxName',
        buildType: maven,
        cloudant: true,
        createType: options.prompts.createType,
        frameworkType: frameworkType,
        objectStorage: false,
        ymlName: 'bxName'
      });
      assert.assertCloudant({ exists: true, buildType: maven, frameworkType: frameworkType });
      assert.assertObjectStorage({ exists: false, buildType: maven, frameworkType: frameworkType });
      assert.assertCompiles(maven);
    });

    describe('Generates a basic ' + frameworkType + ' web project (bluemix) with Object Storage', function () {
      const options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['objectStorage'];
      options.values.bluemix.objectStorage = constant.BX_OBJECT_STORAGE;
      before(options.before.bind(options));

      const assert = new AssertBasicWeb(frameworkType);
      assert.assert({
        appName: 'bxName',
        buildType: maven,
        cloudant: false,
        createType: options.prompts.createType,
        frameworkType: frameworkType,
        objectStorage: true,
        ymlName: 'bxName'
      });
      assert.assertCloudant({ exists: false, buildType: maven, frameworkType: frameworkType });
      assert.assertObjectStorage({ exists: true, buildType: maven, frameworkType: frameworkType });
      assert.assertCompiles(maven);
    });

    describe('Generates a basic ' + frameworkType + ' web project (bluemix) with Cloudant and Object Storage', function () {
      const options = new Options(true, 'maven', frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant', 'objectStorage'];
      options.values.bluemix.cloudant = constant.BX_CLOUDANT;
      options.values.bluemix.objectStorage = constant.BX_OBJECT_STORAGE;
      before(options.before.bind(options));

      const assert = new AssertBasicWeb(frameworkType);
      assert.assert({
        appName: 'bxName',
        buildType: maven,
        cloudant: true,
        createType: options.prompts.createType,
        frameworkType: frameworkType,
        objectStorage: true,
        ymlName: 'bxName'
      });
      assert.assertCloudant({ exists: true, buildType: maven, frameworkType: frameworkType });
      assert.assertObjectStorage({ exists: true, buildType: maven, frameworkType: frameworkType });
      assert.assertCompiles(maven);
    });
  });
});
