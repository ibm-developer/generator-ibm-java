/*
 * © Copyright IBM Corp. 2017, 2018
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

/* Test to see if when you choose every technology type it builds */

'use strict';

const testAsserts = require('../../index').testAsserts;
const assert = testAsserts.builds;
const constant = testAsserts.constant;
const helpers = require('yeoman-test');
const path = require('path');

function Options(buildType, framework) {
  const platform = framework === constant.FRAMEWORK_SPRING ? 'SPRING' : 'JAVA';
  this.options = {
    buildType: buildType,
    createType: 'bff/' + framework,
    appName: constant.APPNAME,
    groupId: constant.GROUPID,
    artifactId: constant.ARTIFACTID,
    version: constant.VERSION,
    bluemix: {
      backendPlatform: platform,
      name: constant.APPNAME
    }
  }

  this.before = function () {
    return helpers.run(path.join(__dirname, '../../generators/app'))
      .withOptions(this.options)
      .toPromise();
  }
}

const buildTypes = [/*'gradle',*/ 'maven'];

describe('java generator : bff/liberty end to end test', function () {
  this.timeout(20000);
  for (let i = 0; i < buildTypes.length; i++) {
    describe('Generates a bff project build type ' + buildTypes[i], function () {
      const options = new Options(buildTypes[i], constant.FRAMEWORK_LIBERTY);
      before(options.before.bind(options));
      assert.assertBuilds(buildTypes[i]);
    });
  }
});

describe('java generator : bff/spring end to end test', function () {
  this.timeout(20000);
  for (let i = 0; i < buildTypes.length; i++) {
    describe('Generates a bff project build type ' + buildTypes[i], function () {
      const options = new Options(buildTypes[i], constant.FRAMEWORK_SPRING);
      before(options.before.bind(options));
      assert.assertBuilds(buildTypes[i]);
    });
  }
});
