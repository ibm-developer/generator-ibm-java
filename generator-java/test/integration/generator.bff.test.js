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

const testAsserts = require('../../index').testAsserts;
const AssertBFF = testAsserts.starters.bff;
const constant = testAsserts.constant;
const core = require('../lib/core');
const extend = require('extend');

class Options extends core.Options {
  constructor(buildType, frameworkType, name) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
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
const assert = new AssertBFF();

describe('java generator : bff integration test', function () {
  this.timeout(50000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a basic bff project (no bluemix), gradle build', function () {
      const options = new Options(gradle, frameworkType, constant.APPNAME);
      before(options.before.bind(options));
      assert.assert(options.values.appName, options.values.appName, gradle, frameworkType, options.values.createType, false, false);
    });

    describe('Generates a basic bff project (no bluemix), maven build', function () {
      const options = new Options(maven, frameworkType, constant.APPNAME);
      before(options.before.bind(options));
      assert.assert(options.values.appName, options.values.appName, maven, frameworkType, options.values.createType, false, false);
    });

    describe('Generates a basic bff project (bluemix) with cloudant', function () {
      const options = new Options(maven, frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant'];
      options.values.bluemix.cloudant = constant.BX_CLOUDANT;
      before(options.before.bind(options));
      assert.assert(options.values.appName, options.values.appName, maven, frameworkType, options.values.createType, true, false);
    });

    describe('Generates a basic bff project (bluemix) with Object Storage', function () {
      const options = new Options(maven, frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['objectStorage'];
      options.values.bluemix.objectStorage = constant.BX_OBJECT_STORAGE;
      before(options.before.bind(options));
      assert.assert(options.values.appName, options.values.appName, maven, frameworkType, options.values.createType, false, true);
    });

    describe('Generates a basic bff project (bluemix) with Cloudant and Object Storage', function () {
      const options = new Options(maven, frameworkType, 'bxName');
      options.values.bluemix.server = constant.BX_SERVER;
      options.values.bluemix.server.services = ['cloudant', 'objectStorage'];
      options.values.bluemix.cloudant = constant.BX_CLOUDANT;
      options.values.bluemix.objectStorage = constant.BX_OBJECT_STORAGE;
      before(options.before.bind(options));
      assert.assert(options.values.appName, options.values.appName, maven, frameworkType, options.values.createType, true, true);
    });
  });
});
