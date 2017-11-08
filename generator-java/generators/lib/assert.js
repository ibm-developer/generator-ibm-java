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
  constructor({ appName, buildType, frameworkType }) {
    this.appName = appName;
    this.buildType = buildType;
    this.frameworkType = frameworkType;
  }

  assert() {
    this.assertBuild();
    this.assertFramework();
    if (this.frameworkType === constant.FRAMEWORK_LIBERTY) this.assertliberty();
    if (this.frameworkType === constant.FRAMEWORK_SPRING) this.assertspring();
    common.assertCommonFiles(this.frameworkType);
  }

  assertBuild() {
    const test = tests.test(this.buildType);
    test.assertApplication(this.appName, constant.GROUPID, constant.ARTIFACTID, constant.VERSION);
  }

  assertCompiles() {
    command.run(tests.test(this.buildType).getCompileCommand());
  }
  
  assertFramework() {
    framework.test(this.frameworkType).assertFiles(this.appName);
    framework.test(this.frameworkType).assertBuildFiles(this.buildType);
  }

  assertliberty() {
    common.assertCommonLibertyFiles();
  }

  assertspring() {
    common.assertCommonSpringFiles();
  }
}

module.exports = exports = Assert;
