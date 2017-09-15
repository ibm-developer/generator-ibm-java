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
 * Tests the BFF generator works as called from YaaS
 */

'use strict'
const tests = require('@arf/common-codegen-tests');
const generatorLocation = require('path').join(__dirname, '../../generators/app');
const APPNAME = 'testApp';

//common generator tests
function assertCommonTests(options, backendPlatform) {
  tests.test('test-cli-config', generatorLocation, backendPlatform, options);
  //run the docker test slightly differently as need to specify a back level version of the test
  var dockerTest = tests.test('test-docker');
  dockerTest.generatorLocation = generatorLocation;
  dockerTest.platform = backendPlatform;
  dockerTest.options = options;
  dockerTest.version = '0.0.2';
  tests.test('test-bluemix', generatorLocation, backendPlatform, options);
  tests.test('test-pattern-bff', generatorLocation, backendPlatform, options);
}

describe('java generator : bff/yaas : liberty/javaee, gradle build, no bluemix services', function () {
  this.timeout(25000);
  var ymock = new tests.YMock(APPNAME, "JAVA", {headless : 'true', buildType : 'gradle', createType: 'bff/liberty'});
  var options = ymock.getOptions();
  options.bluemix.backendPlatform = options.backendPlatform;
  assertCommonTests(options, 'JAVA');
});

describe('java generator : bff/yaas : liberty/javaee, maven build, no bluemix services', function () {
  this.timeout(25000);
  var ymock = new tests.YMock(APPNAME, "JAVA", {headless : 'true', buildType : 'maven', createType: 'bff/liberty'});
  var options = ymock.getOptions();
  options.bluemix.backendPlatform = options.backendPlatform;
  assertCommonTests(options, 'JAVA');
});

describe('java generator : bff/yaas : spring, gradle build, no bluemix services', function () {
  this.timeout(25000);
  var ymock = new tests.YMock(APPNAME, "SPRING", {headless : 'true', buildType : 'gradle', createType: 'bff/spring'});
  var options = ymock.getOptions();
  options.bluemix.backendPlatform = options.backendPlatform;
  assertCommonTests(options, 'SPRING');
});

describe('java generator : bff/yaas : spring, maven build, no bluemix services', function () {
  this.timeout(25000);
  var ymock = new tests.YMock(APPNAME, "SPRING", {headless : 'true', buildType : 'maven', createType: 'bff/spring'});
  var options = ymock.getOptions();
  options.bluemix.backendPlatform = options.backendPlatform;
  assertCommonTests(options, 'SPRING');
});
