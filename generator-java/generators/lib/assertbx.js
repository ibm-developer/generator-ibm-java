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

function getCheck(exists) {
    return {
        file: exists ? assert.file : assert.noFile,
        desc: exists ? 'should create ' : 'should not create ',
        content: exists ? assert.fileContent : assert.noFileContent
    }
}

class AssertBx extends Assert {
    assert({ appName, buildType, cloudant, createType, frameworkType, objectStorage, ymlName }) {
        super.assert(appName, buildType, frameworkType);
        
        common.assertCommonBxFiles();
        common.assertCLI(appName);
        common.assertManifestYml(ymlName, cloudant || objectStorage);
        if (frameworkType === constant.FRAMEWORK_SPRING) common.assertBluemixSrcSvcEnabled(cloudant || objectStorage);
        if (frameworkType === constant.FRAMEWORK_LIBERTY) common.assertBluemixSrc(cloudant || objectStorage);

        kube.test(appName, true, frameworkType, createType, cloudant, objectStorage);
        this.assertCloudant({ exists: cloudant, buildType: buildType });
        this.assertObjectStorage({ exists: objectStorage, buildType: buildType });

        framework.test(frameworkType).assertCloudant(cloudant);
        framework.test(frameworkType).assertObjectStorage(objectStorage);
    }

    assertCloudant({ exists, buildType }) {
        const check = getCheck(exists);
        it(check.desc + 'cloudant README entry', function () {
            if (exists) {
                check.content('README.md', 'cloudant');
            }
        });
        if (exists) {
            tests.test(buildType).assertDependency('compile', 'com.cloudant', 'cloudant-client', '2.7.0');
        }
    }

    assertObjectStorage({ exists, buildType }) {
        const check = getCheck(exists);
        it(check.desc + 'Object Storage README entry', function () {
            if (exists) {
                check.content('README.md', 'Object Storage service');
            }
        });
        if (exists) {
            tests.test(buildType).assertDependency('compile', 'org.pacesys', 'openstack4j-core', '3.0.3');
            tests.test(buildType).assertDependency('compile', 'org.pacesys.openstack4j.connectors', 'openstack4j-httpclient', '3.0.3');
        }
    }
}

module.exports = exports = AssertBx;
