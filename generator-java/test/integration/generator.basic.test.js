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

class Options extends core.BxOptions {

  assert(appName, ymlName) {
    common.assertCommonBxFiles();
    common.assertCLI(appName);
    common.assertManifestYml(ymlName, false);
    kube.test(appName, true);
    super.assertCloudant(false);
    super.assertObjectStorage(false);
    common.assertToolchainBxEnable();
  }

}

const frameworks = ['liberty', 'spring'];

frameworks.forEach(framework => {
  describe('java generator : basic integration test : ' + framework, function () {

    describe('Generates a basic project (bluemix enabled), gradle build : ' + framework, function () {
      var options = new Options();
      options.prompts = {extName : 'prompt:patterns', buildType : 'gradle', createType: 'basic/' + framework, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME);
    });

    describe('Generates a basic  project (bluemix enabled), maven build : ' + framework, function () {
      var options = new Options();
      options.prompts = {extName : 'prompt:patterns', buildType : 'maven', createType: 'basic/' + framework, services: ['none'], appName: core.APPNAME, artifactId: core.ARTIFACTID};
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME);
    });

  });
});

