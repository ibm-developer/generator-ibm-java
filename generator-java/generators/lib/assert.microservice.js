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
const framework = require('../../test/lib/test-framework');
const tests = require('@arf/java-common');

class AssertMicroservice extends AssertBx {
    assert({ appName, buildType, cloudant, createType, frameworkType, objectStorage, ymlName }) {
        super.assert({
            appName: appName,
            buildType: buildType,
            cloudant: cloudant,
            createType: createType,
            frameworkType: frameworkType,
            objectStorage: objectStorage,
            ymlName: ymlName
        });
        super.assertBuild(appName, buildType);
        if (frameworkType === constant.FRAMEWORK_LIBERTY) this.assertliberty({ buildType: buildType });
        if (frameworkType === constant.FRAMEWORK_SPRING) this.assertspring();
        this.assertCloudant({ exists: cloudant, frameworkType: frameworkType });
        this.assertObjectStorage({ exists: objectStorage, frameworkType: frameworkType });
        common.assertToolchainBxCreate();
        it('Check that common source files exist', function () {
            assert.fileContent('src/main/java/application/rest/v1/Example.java', 'Congratulations');
        });
    }

    assertliberty({ buildType }) {
        super.assertliberty();
        const test = tests.test(buildType);
        test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
        test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
        test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
        test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
        const type = buildType === 'maven' ? 'pom' : undefined;
        test.assertDependency('provided', 'io.microprofile', 'microprofile', '1.0.0', undefined, type);
        framework.test(constant.FRAMEWORK_LIBERTY).assertSourceFiles(false);
        framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('microprofile-1.0');
        framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jndi-1.0');
    }

    assertspring() {
        super.assertspring();
        framework.test(constant.FRAMEWORK_SPRING).assertContent('/index.html');
        framework.test(constant.FRAMEWORK_SPRING).assertContent('/error/404.html');
        it('Check that common Spring source files exist', function () {
            assert.fileContent('src/main/java/application/Info.java', 'http://localhost:8080/v1/'); // standard info is there
        });
    }

    assertCloudant({ exists, frameworkType }) {
        const check = this.getCheck(exists);
        const invcheck = this.getCheck(exists ^ exists);
        it(check.desc + 'common cloudant source files', function () {
            check.content('src/main/java/application/rest/v1/Example.java', 'Cloudant'); // check Cloudant service present
            check.content('src/main/java/application/rest/v1/Example.java', 'import com.cloudant.client.api.CloudantClient;');
            check.content('README.md', 'cloudant');
        });
        if (frameworkType === constant.FRAMEWORK_LIBERTY) {
            it(check.desc + 'Liberty cloudant source files', function () {
                check.file('src/main/java/application/cloudant/Cloudant.java')
            });
            it(invcheck.desc + 'Spring cloudant source files', function () {
                invcheck.file('src/main/java/application/cloudant/CloudantClientConfig.java')
            });
        }
        if (frameworkType === constant.FRAMEWORK_SPRING) {
            it(invcheck.desc + 'Liberty cloudant source files', function () {
                invcheck.file('src/main/java/application/cloudant/Cloudant.java');
            });
            it(check.desc + 'Spring cloudant source files', function () {
                check.file('src/main/java/application/cloudant/CloudantClientConfig.java');
                check.content('src/main/java/application/Info.java', 'http://localhost:8080/v1/cloudant'); // standard info is there
            });
        }
    }

    assertObjectStorage({ exists, frameworkType }) {
        const check = this.getCheck(exists);
        const invcheck = this.getCheck(exists ^ exists);
        it(check.desc + 'Object Storage source files', function () {
            check.content('src/main/java/application/rest/v1/Example.java', 'OSClient'); // check object Storage service present
            check.content('src/main/java/application/rest/v1/Example.java', 'import org.openstack4j.model.storage.object.SwiftAccount;');
            check.content('README.md', 'Object Storage service');
        });
        if (frameworkType === constant.FRAMEWORK_LIBERTY) {
            it(check.desc + 'Liberty objectStorage source files', function () {
                check.file('src/main/java/application/objectstorage/ObjectStorage.java')
            });
            it(invcheck.desc + 'Spring objectStorage source files', function () {
                invcheck.file('src/main/java/application/objectstorage/ObjectStorageConfig.java')
            });
        }
        if (frameworkType === constant.FRAMEWORK_SPRING) {
            it(invcheck.desc + 'Liberty objectStorage source files', function () {
                invcheck.file('src/main/java/application/objectstorage/ObjectStorage.java')
            });
            it(check.desc + 'Spring objectStorage source files', function () {
                check.file('src/main/java/application/objectstorage/ObjectStorageConfig.java')
                check.content('src/main/java/application/Info.java', 'http://localhost:8080/v1/objectstorage'); //standard info is there
            });
        }
    }
}

module.exports = exports = AssertMicroservice;
