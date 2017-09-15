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
const command = tests.test('command');
const core = require('../lib/core');
const extend = require('extend');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK_LIBERTY = 'liberty';
const FRAMEWORK_SPRING = 'spring';

class Options extends core.Options {
  constructor(runHeadless, buildType, frameworkType, name) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless : runHeadless.toString(),
      buildType : buildType,
      frameworkType : frameworkType,
      createType : 'blank/' + frameworkType,
      appName : name || core.APPNAME
    });
  }

  assert(appName, ymlName) {
    super.assert(appName, ymlName, false, false);
  }

  assertCompiles(buildType) {
    command.run(tests.test(buildType).getCompileCommand());
  }
}

var frameworkTypes = ['liberty', 'spring'];

describe('java generator : basic integration test', function () {
  this.timeout(7000);
  frameworkTypes.forEach(frameworkType => {
    describe('Generates a basic ' + frameworkType + ' blank project (no bluemix), gradle build with prompts', function () {
      var options = new Options(false, 'gradle', frameworkType);
      options.prompts = {extName : 'prompt:patterns', buildType : 'gradle', createType: 'blank/' + frameworkType, services: ['none'], appName: APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME);
    });

    describe('Generates a basic ' + frameworkType + ' blank project (no bluemix), maven build with prompts', function () {
      var options = new Options(false, 'maven', frameworkType);
      options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'blank/' + frameworkType, services: ['none'], appName: APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME);
    });

    describe('Generates a basic ' + frameworkType + ' blank project (no bluemix), gradle build', function () {
      var options = new Options(true, 'gradle', frameworkType, APPNAME);
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME);
      options.assertCompiles('gradle');
    });

    describe('Generates a basic ' + frameworkType + ' blank project (no bluemix), maven build', function () {
      var options = new Options(true, 'maven', frameworkType, APPNAME);
      before(options.before.bind(options));
      options.assert(APPNAME, APPNAME);
      options.assertCompiles('maven');
    });

  });

});
