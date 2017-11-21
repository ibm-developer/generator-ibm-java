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
 * Tests creating a project via the usecase generator / starter kit (skit) rather than 
 * an in-built one such as microservice
 */

'use strict';

const AssertSkit = require('../../generators/lib/test/integration/assert.skit');
const constant = require('../../generators/lib/test/constant');
const core = require('../lib/core');
const extend = require('extend');
const path = require('path');
const tests = require('@arf/java-common');

//where the test skit resources are found for local testing
const SKIT_PATH = JSON.stringify(path.join(__dirname, '..', "resources", "skit"));

class Options extends core.Options {
  constructor(runHeadless, buildType, frameworkType) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless: runHeadless.toString(),
      buildType: buildType,
      frameworkType: frameworkType,
      createType: 'skit/' + frameworkType,
      appName: constant.APPNAME,
      starter : '"local"',
      starterOptions : SKIT_PATH
    });
  }
}

const frameworkTypes = ['liberty', 'spring'];
const gradle = 'gradle';
const maven = 'maven';
const assert = new AssertSkit();

describe('java generator : starter kit (skit) integration test', function () {
  this.timeout(7000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a ' + frameworkType + ' starter kit, gradle build with prompts', function () {      
      const options = new Options(false, gradle, frameworkType);
      options.prompts = { extName: 'prompt:patterns', buildType: gradle, createType: options.values.createType, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID };
      before(options.before.bind(options));
      assert.assert(constant.APPNAME, gradle, frameworkType);
    });

    describe('Generates a ' + frameworkType + ' starter kit, maven build with prompts', function () {
      const options = new Options(false, maven, frameworkType);
      options.prompts = { extName: 'prompt:patterns', buildType: maven, createType: options.values.createType, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID };
      before(options.before.bind(options));
      assert.assert(constant.APPNAME, maven, frameworkType);
    });

    describe('Generates a ' + frameworkType + ' starter kit, gradle build', function () {
      const options = new Options(true, gradle, frameworkType, core.APPNAME);
      before(options.before.bind(options));
      assert.assert(constant.APPNAME, gradle, frameworkType);
    });

    describe('Generates a ' + frameworkType + ' starter kit, maven build', function () {
      const options = new Options(true, maven, frameworkType, core.APPNAME);
      before(options.before.bind(options));
      assert.assert(constant.APPNAME, maven, frameworkType);
    });
  
  });
});