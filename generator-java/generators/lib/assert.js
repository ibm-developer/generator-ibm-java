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

const common = require('../../test/lib/test-common');
const constant = require('../../test/lib/constant');
const framework = require('../../test/lib/test-framework');
const tests = require('@arf/java-common');
const command = tests.test('command');

class Assert {
  constructor(frameworkType) {
    this.frameworkType = frameworkType;
  }

  assert(appName, buildType, frameworkType) {
    common.assertCommonFiles(frameworkType);
    this.assertBuild(appName, buildType);
    this.assertFramework(appName, buildType, frameworkType);
    if (frameworkType === constant.FRAMEWORK_LIBERTY) this.assertliberty(buildType);
    if (frameworkType === constant.FRAMEWORK_SPRING) this.assertspring(buildType);
  }

  assertBuild(appName, buildType) {
    const test = tests.test(buildType);
    test.assertApplication(appName, constant.GROUPID, constant.ARTIFACTID, constant.VERSION);
  }

  assertCompiles(buildType) {
    command.run(tests.test(buildType).getCompileCommand());
  }

  // general framework tests which apply to all of them
  assertFramework(appName, buildType, frameworkType) {
    framework.test(frameworkType).assertFiles(appName);
    framework.test(frameworkType).assertBuildFiles(buildType);
  }

  assertliberty() {
    common.assertCommonLibertyFiles();
  }

  assertspring() {
    common.assertCommonSpringFiles();
  }
}

module.exports = exports = Assert;
