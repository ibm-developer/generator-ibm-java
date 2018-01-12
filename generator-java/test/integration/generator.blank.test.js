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
const AssertBlank = testAsserts.starters.blank;
const constant = testAsserts.constant;
const core = require('../lib/core');
const extend = require('extend');

class Options extends core.Options {
  constructor(buildType, frameworkType, name) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      buildType: buildType,
      frameworkType: frameworkType,
      createType: 'blank/' + frameworkType,
      appName: name || constant.APPNAME
    });
  }
}

const frameworkTypes = [constant.FRAMEWORK_LIBERTY, constant.FRAMEWORK_SPRING];
const gradle = 'gradle';
const maven = 'maven';
const assert = new AssertBlank();

describe('java generator : basic integration test', function () {
  this.timeout(7000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a basic ' + frameworkType + ' blank project (no bluemix), gradle build', function () {
      const options = new Options(gradle, frameworkType, constant.APPNAME);
      before(options.before.bind(options));
      assert.assert(options.values.appName, gradle, frameworkType);
    });

    describe('Generates a basic ' + frameworkType + ' blank project (no bluemix), maven build', function () {
      const options = new Options(maven, frameworkType, constant.APPNAME);
      before(options.before.bind(options));
      assert.assert(options.values.appName, maven, frameworkType);
    });
  });
});
