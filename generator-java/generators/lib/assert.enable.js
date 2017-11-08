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

const AssertBx = require('./assertbx');
const assert = require('yeoman-assert');
const common = require('../../test/lib/test-common');
const constant = require('../../test/lib/constant');
const kube = require('../../test/lib/test-kube');

const USAGE_TXT = 'usage.txt';

class AssertEnable extends AssertBx {
    assert() {
        super.assertCloudant();
        super.assertObjectStorage();
        it('generates ' + USAGE_TXT + ' file', function () {
            assert.file(USAGE_TXT);
        });
        common.assertCLI(this.appName);
        common.assertCommonFiles(this.frameworkType);
        common.assertCommonBxFiles();
        common.assertManifestYml(this.ymlName, false);
        common.assertToolchainBxEnable();
        kube.test(this.appName, true, this.frameworkType, this.createType, false, false);
        if (this.frameworkType === constant.FRAMEWORK_LIBERTY) this.assertliberty();
        if (this.frameworkType === constant.FRAMEWORK_SPRING) this.assertspring();
    }

    assertliberty() {
        const buildType = this.buildType;
        const appPath = buildType === 'maven' ? 'target' : 'build';
        const libertyInstall = buildType === 'maven' ? 'target/liberty/wlp' : 'build/wlp';
        const buildTypeCap = buildType.charAt(0).toUpperCase() + buildType.slice(1);
        it(USAGE_TXT + ' file should contain correct content', function () {
            assert.fileContent(USAGE_TXT, 'default health endpoint is /' + constant.APPNAME + '/health');
            assert.fileContent(USAGE_TXT, 'artifact location is ' + appPath + '/' + constant.ARTIFACTID + '-' + constant.VERSION + '.zip');
            assert.fileContent(USAGE_TXT, 'Liberty ' + buildTypeCap + ' plugin (https://github.com/WASdev/ci.' + buildType + ')');
            assert.fileContent(USAGE_TXT, 'install location is ' + libertyInstall);
        })
    }

    assertspring() {
        const appPath = this.buildType === 'maven' ? 'target' : 'build/libs';
        it(USAGE_TXT + ' file should contain correct content', function () {
            assert.fileContent(USAGE_TXT, 'default health endpoint is /health');
            assert.fileContent(USAGE_TXT, 'artifact location is ' + appPath + '/' + constant.ARTIFACTID + '-' + constant.VERSION + '.jar');
        })
    }
}

module.exports = exports = AssertEnable;
