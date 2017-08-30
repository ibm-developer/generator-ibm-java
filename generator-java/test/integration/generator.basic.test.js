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
const core = require('../lib/core');
const common = require('../lib/test-common');
const kube = require('../lib/test-kube');

const USAGE_TXT = 'usage.txt';

class Options extends core.BxOptions {

  constructor(framework) {
    let backendPlatform = framework === 'spring' ? 'SPRING' : 'JAVA';
    super(backendPlatform)
  }

  assert(appName, ymlName, framework, createType, buildType) {
    it('generates ' + USAGE_TXT + ' file', function() {
      assert.file(USAGE_TXT);
    });
    common.assertCommonFiles(framework);
    common.assertCommonBxFiles();
    common.assertCLI(appName);
    common.assertManifestYml(ymlName, false);
    kube.test(appName, true, framework, createType);
    super.assertCloudant(false);
    super.assertObjectStorage(false);
    common.assertToolchainBxEnable();
    this['assert' + framework](buildType);
  }

  assertliberty(buildType) {
    var appPath = buildType === 'maven' ? 'target' : 'build';
    var libertyInstall = buildType === 'maven' ? 'target/liberty/wlp' : 'build/wlp';
    var buildTypeCap = buildType.charAt(0).toUpperCase() + buildType.slice(1);
    it(USAGE_TXT + ' file should contain correct content', function() {
      assert.fileContent(USAGE_TXT, 'default health endpoint is /' + core.APPNAME + '/health');
      assert.fileContent(USAGE_TXT, 'artifact location is ' + appPath + '/' + core.APPNAME + '.zip');
      assert.fileContent(USAGE_TXT, 'Liberty ' + buildTypeCap + ' plugin (https://github.com/WASdev/ci.' + buildType + ')');
      assert.fileContent(USAGE_TXT, 'install location is ' + libertyInstall);
    })
  }

  assertspring(buildType) {
    var appPath = buildType === 'maven' ? 'target' : 'build/libs';
    it(USAGE_TXT + ' file should contain correct content', function() {
      assert.fileContent(USAGE_TXT, 'default health endpoint is /health');
      assert.fileContent(USAGE_TXT, 'artifact location is ' + appPath + '/' + core.APPNAME + '.jar');
    })
  }

}

const frameworks = ['liberty', 'spring'];

frameworks.forEach(framework => {
  describe('java generator : basic integration test : ' + framework, function () {
    this.timeout(7000);

    describe('Generates a basic project (bluemix enabled), gradle build : ' + framework, function () {
      var options = new Options(framework);
      options.prompts = {extName : 'prompt:patterns', buildType : 'gradle', createType: 'basic/' + framework, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, framework, 'basic/' + framework, 'gradle');
    });

    describe('Generates a basic  project (bluemix enabled), maven build : ' + framework, function () {
      var options = new Options(framework);
      options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'basic/' + framework, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, framework, 'basic/' + framework, 'maven');
    });

  });
});

