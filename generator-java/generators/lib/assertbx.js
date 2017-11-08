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

const Assert = require('./assert');
const assert = require('yeoman-assert');
const common = require('../../test/lib/test-common');
const constant = require('../../test/lib/constant');
const framework = require('../../test/lib/test-framework');
const kube = require('../../test/lib/test-kube');
const tests = require('@arf/java-common');

class AssertBx extends Assert {
    constructor({ appName, buildType, cloudant, createType, frameworkType, objectStorage, ymlName }) {
        super({ appName: appName, buildType: buildType, frameworkType: frameworkType });
        this.cloudant = cloudant;
        this.createType = createType;
        this.objectStorage = objectStorage;
        this.ymlName = ymlName;
    }

    getCheck(exists) {
        return {
            file: exists ? assert.file : assert.noFile,
            desc: exists ? 'should create ' : 'should not create ',
            content: exists ? assert.fileContent : assert.noFileContent
        }
    }

    assert() {
        super.assert();
        this.assertCloudant(this.cloudant);
        this.assertObjectStorage(this.objectStorage);
        if (this.frameworkType === constant.FRAMEWORK_SPRING) common.assertBluemixSrcSvcEnabled(this.cloudant || this.objectStorage);
        if (this.frameworkType === constant.FRAMEWORK_LIBERTY) common.assertBluemixSrc(this.cloudant || this.objectStorage);
        common.assertCommonBxFiles();
        common.assertCLI(this.appName);
        common.assertManifestYml(this.ymlName, this.cloudant || this.objectStorage);
        kube.test(this.appName, true, this.frameworkType, this.createType, this.cloudant, this.objectStorage);
        framework.test(this.frameworkType).assertCloudant(this.cloudant);
        framework.test(this.frameworkType).assertObjectStorage(this.objectStorage);
    }

    assertCloudant() {
        const check = this.getCheck(this.cloudant);
        it(check.desc + 'cloudant README entry', function () {
            if (this.cloudant) {
                check.content('README.md', 'cloudant');
            }
        });
        if (this.cloudant) {
            tests.test(this.buildType).assertDependency('compile', 'com.cloudant', 'cloudant-client', '2.7.0');
        }
    }

    assertObjectStorage() {
        const check = this.getCheck(this.objectStorage);
        it(check.desc + 'Object Storage README entry', function () {
            if (this.objectStorage) {
                check.content('README.md', 'Object Storage service');
            }
        });
        if (this.objectStorage) {
            tests.test(this.buildType).assertDependency('compile', 'org.pacesys', 'openstack4j-core', '3.0.3');
            tests.test(this.buildType).assertDependency('compile', 'org.pacesys.openstack4j.connectors', 'openstack4j-httpclient', '3.0.3');
        }
    }
}

module.exports = exports = AssertBx;
