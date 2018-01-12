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

/* Test to see if when you choose every technology type it builds */

'use strict';

const testAsserts = require('../../index').testAsserts;
const assert = testAsserts.builds;
const constant = testAsserts.constant;
const helpers = require('yeoman-test');
const path = require('path');

function Options(createType, buildType, testBluemix, technologies) {
  this.options = {
    buildType: buildType,
    createType: createType,
    technologies: technologies,
    appName: constant.APPNAME,
    groupId: constant.GROUPID,
    artifactId: constant.ARTIFACTID,
    version: constant.VERSION,
    bluemix: {
      backendPlatform: 'JAVA'
    }
  }
  
  this.before = function () {
    return helpers.run(path.join(__dirname, '../../generators/app'))
      .withOptions(this.options)
      .toPromise();
  }
}

describe('java generator : technologies end to end test', function () {
  this.timeout(7000);
  const buildTypes = ['gradle', 'maven'];
  for (let i = 0; i < buildTypes.length; i++) {
    describe('Generates a project with springbootweb technology type and build type ' + buildTypes[i], function () {
      const technologies = ['springbootweb'];
      const options = new Options('picnmix', buildTypes[i], false, technologies);
      before(options.before.bind(options));
      assert.assertBuilds(buildTypes[i]);
    });

    describe('Generates a project with all technologies except springbootweb and build type ' + buildTypes[i], function () {
      const technologies = ['rest', 'microprofile', 'persistence', 'websocket', 'web', 'watsonsdk', 'swagger'];
      const options = new Options('picnmix', buildTypes[i], false, technologies);
      before(options.before.bind(options));
      assert.assertBuilds(buildTypes[i]);
    });
  }
});
