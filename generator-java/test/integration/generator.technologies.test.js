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

/**
 * Tests the microservice generator
 */

'use strict';

const testAsserts = require('../../index').testAsserts;
const AssertTechnologies = testAsserts.starters.technologies;
const bluemix = testAsserts.bluemix;
const constant = testAsserts.constant;
const core = require('../lib/core');
const extend = require('extend');
const liberty = require('../../generators/liberty/exports');

class Options extends core.Options {
  constructor(createType, buildType, platforms, technologies) {
    super();
    this.assertTech = new liberty.integrationAsserts.technologies();
    extend(this.values, {
      buildType: buildType,
      platforms: platforms,
      createType: createType,
      technologies: technologies,
      appName: constant.APPNAME,
      artifactId: constant.ARTIFACTID
    });
  }
}

const technologies = ['rest', 'microprofile', 'persistence', 'websocket', 'web', 'watsonsdk', 'swagger', 'springbootweb', 'msbuilder'];
const buildTypes = [/*'gradle',*/ 'maven'];

execute('picnmix', 'picnmix', technologies);

function execute(createType, assertFunc, technologiesToTest) {
  describe('java generator : technologies integration test', function () {
    this.timeout(7000);
    for (let i = 0; i < technologiesToTest.length; i++) {
      for (let j = 0; j < buildTypes.length; j++) {
        describe('Generates a ' + createType + ' project for ' + technologiesToTest[i] + ' (' + buildTypes[j] + ', no bluemix)', function () {
          const options = new Options(createType, buildTypes[j], [], [technologiesToTest[i]]);
          before(options.before.bind(options));

          const assert = new AssertTechnologies({
            appName: options.values.appName,
            buildType: buildTypes[j],
            frameworkType: constant.FRAMEWORK_LIBERTY
          });
          assert['assert' + assertFunc]();

          const func = options['assert' + technologiesToTest[i]];
          // see if there is a local override in place or default through to the underlying technology checker
          if (func) {
            func();
          } else {
            assert.defaultAssertTech(technologiesToTest[i]);
          }

          if (technologiesToTest[i] === 'springbootweb' && createType === 'picnmix') {
            assert.assertTech.assertspringbootwebonly(assert.buildType);
          }

          if (technologiesToTest[i] === 'msbuilder' && createType === 'picnmix') {
            assert.assertmsbuilderwithname();
          } else {
            assert.assertNoKube();
          }

          bluemix.test(false);
        });
      }
    }
  });
}

describe('java generator : technologies integration test', function () {
  this.timeout(7000);
  for (let i = 0; i < buildTypes.length; i++) {
    describe('Generates a project for (no services or technologies)', function () {
      const options = new Options('picnmix', buildTypes[i], [], []);
      before(options.before.bind(options));
      const assert = new AssertTechnologies({
        appName: options.values.appName,
        buildType: buildTypes[i],
        frameworkType: constant.FRAMEWORK_LIBERTY
      });
      assert.assert();
      assert.assertTech.asserthealthdeps(assert.buildType);
      assert.assertNoKube();
      bluemix.test(false);
    });
  }

  for (let i = 0; i < buildTypes.length; i++) {
    describe('Generates a project for (no services or technologies) with bluemix', function () {
      const options = new Options('picnmix', buildTypes[i], ['bluemix'], []);
      before(options.before.bind(options));
      const assert = new AssertTechnologies({
        appName: options.values.appName,
        buildType: buildTypes[i],
        frameworkType: constant.FRAMEWORK_LIBERTY
      });
      assert.assert();
      assert.assertTech.asserthealthdeps(assert.buildType);
      assert.assertNoKube();
      bluemix.test(true);
    });
  }
});
