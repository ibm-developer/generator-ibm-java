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

const AssertBx = require('./assertbx');
const assert = require('yeoman-assert');
const common = require('../../test/lib/test-common');
const constant = require('../../test/lib/constant');
const framework = require('../../test/lib/test-framework');
const tests = require('@arf/java-common');

class AssertBasicWeb extends AssertBx {
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
        const base = frameworkType === constant.FRAMEWORK_SPRING ? 'src/main/resources/static' : 'src/main/webapp';
        common.assertFiles(base, true, 'index.html', '/css/default.css', 'js/bundle.js');
        framework.test(frameworkType).assertSourceFiles(false);
        if (frameworkType === constant.FRAMEWORK_LIBERTY) this.assertliberty(buildType);
        if (frameworkType === constant.FRAMEWORK_SPRING) this.assertspring(buildType);
    }

    assertliberty(buildType) {
        super.assertliberty();
        const test = tests.test(buildType);
        test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
        test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
        test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
        test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
        framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
        framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('servlet-3.1');
    }

    assertspring(buildType) {
        super.assertspring();
        const test = tests.test(buildType);
        test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web');
        test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-actuator');
        test.assertDependency('test', 'org.springframework.boot', 'spring-boot-starter-test');
        it('should contain EndpointTest.java for testing the web endpoint', function () {
            assert.file('src/test/java/application/EndpointTest.java');
        });
        framework.test(constant.FRAMEWORK_SPRING).assertContent('/index.html');
        framework.test(constant.FRAMEWORK_SPRING).assertContent('/error/404.html');
    }

    assertCloudant({ exists, buildType, frameworkType }) {
        super.assertCloudant({ exists: exists, buildType: buildType });
        if (exists && (frameworkType === constant.FRAMEWORK_SPRING)) {
            it('should contain @Lazy for cloudant client', function () {
                assert.fileContent('src/main/java/application/cloudant/CloudantClientConfig.java', '@Lazy');
            });
        }
    }

    assertObjectStorage({ exists, buildType, frameworkType }) {
        super.assertObjectStorage({ exists: exists, buildType: buildType });
        if (exists && (frameworkType === constant.FRAMEWORK_SPRING)) {
            it('should contain @Lazy for ObjectStorage client', function () {
                assert.fileContent('src/main/java/application/objectstorage/ObjectStorageConfig.java', '@Lazy');
            });
        }
    }
}

module.exports = exports = AssertBasicWeb;
