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

const assert = require('yeoman-assert');
const constant = require('../constant');
const framework = require('../assert.framework');
const tests = require('ibm-java-codegen-common');
const command = tests.test('command');

class Assert {
  assert(appName, buildType, frameworkType, createType) {
    this.assertBuild(appName, buildType);
    this.assertCommonFiles(frameworkType);
    this.assertFramework(appName, buildType, frameworkType);
    if (constant.COMPILE) this.assertCompile(buildType);
    if (frameworkType === constant.FRAMEWORK_LIBERTY) this.assertliberty({ appName: appName, buildType: buildType, createType: createType });
    if (frameworkType === constant.FRAMEWORK_SPRING) this.assertspring({ buildType: buildType });
  }

  assertBuild(appName, buildType) {
    const test = tests.test(buildType);
    test.assertApplication(appName, constant.GROUPID, constant.ARTIFACTID, constant.VERSION);
  }

  assertCommonFiles(framework) {
    it('should create common files are present for all configurations', function () {
      assert.file('.gitignore');
      assert.file('Dockerfile');
      assert.file('.dockerignore');
      if (framework === constant.FRAMEWORK_LIBERTY) {
        assert.fileContent('.dockerignore', 'defaultServer/logs');
        assert.fileContent('.dockerignore', 'defaultServer/workarea');
        assert.fileContent('Dockerfile', 'FROM websphere-liberty:webProfile7');
      }
      if (framework === constant.FRAMEWORK_SPRING) {
        assert.fileContent('Dockerfile', 'FROM ibmjava:8-sfj');
      }
    });
  }

  assertCompile(buildType) {
    command.run(tests.test(buildType).getCompileCommand());
  }

  assertFramework(appName, buildType, frameworkType) {
    framework.test(frameworkType).assertFiles(appName);
    framework.test(frameworkType).assertBuildFiles(buildType);
  }

  assertliberty() {
    it('should create common Liberty files are present for all configurations', function () {
      //add specific Liberty file checks
    });
  }

  assertspring() {
    it('should create common Spring files are present for all configurations', function () {
      //add specific Liberty file checks
    });
  }
}

module.exports = exports = Assert;
