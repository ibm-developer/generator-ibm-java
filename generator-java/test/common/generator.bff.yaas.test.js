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
function assertCommonTests(options) {
  tests.test('test-cli-config', generatorLocation, 'JAVA', options);
  tests.test('test-docker', generatorLocation, 'JAVA', options);
  tests.test('test-bluemix', generatorLocation, 'JAVA', options);
  tests.test('test-pattern-bff', generatorLocation, 'JAVA', options);
}

describe('java generator : bff/yaas : gradle build, no bluemix services', function () {
  var ymock = new tests.YMock(APPNAME, "JAVA", {headless : 'true', extName : 'prompt:patterns', buildType : 'gradle', createType: 'bff'});
  assertCommonTests(ymock.getOptions());
});

describe('java generator : bff/yaas : maven build, no bluemix services', function () {
  var ymock = new tests.YMock(APPNAME, "JAVA", {headless : 'true', extName : 'prompt:patterns', buildType : 'maven', createType: 'bff'});
  assertCommonTests(ymock.getOptions());
});
