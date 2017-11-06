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

class AssertBFF extends AssertBx {
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
        framework.test(frameworkType).assertSourceFiles(false);
        if (frameworkType === constant.FRAMEWORK_LIBERTY) this.assertliberty({ buildType: buildType });
        if (frameworkType === constant.FRAMEWORK_SPRING) this.assertspring(buildType);
    }

    assertliberty({ buildType }) {
        super.assertliberty();
        common.assertFiles('src', true, 'main/java/application/rest/SwaggerEndpoint.java',
            'main/java/application/model/Product.java',
            'main/java/application/openapi/ProductsApi.java',
            'main/java/application/openapi/ProductApi.java',
            'test/java/it/ProductsEndpointTest.java',
            'test/java/it/SwaggerEndpointTest.java');
        const test = tests.test(buildType);
        test.assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
        test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
        test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
        framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
        framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('apiDiscovery-1.0');
        framework.test(constant.FRAMEWORK_LIBERTY).assertConfig(true, 'basicRegistry');
        if (buildType === 'maven') test.assertContent('<feature>apiDiscovery-1.0</feature>');
        if (buildType === 'gradle') test.assertContent("name = ['apiDiscovery-1.0']");
    }

    assertspring(buildType) {
        super.assertspring();
        common.assertFiles('src', true, 'main/java/io/swagger/api/ProductApi.java',
            'main/java/io/swagger/api/ProductApiController.java',
            'main/java/io/swagger/api/ProductsApi.java',
            'main/java/io/swagger/api/ProductsApiController.java',
            'main/java/io/swagger/model/Product.java');
        framework.test(constant.FRAMEWORK_SPRING).assertOpenApi(true, [], buildType);
        framework.test(constant.FRAMEWORK_SPRING).assertContent('/index.html');
        framework.test(constant.FRAMEWORK_SPRING).assertContent('/error/404.html');
        const test = tests.test(buildType);
        test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web');
        test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-actuator');
        test.assertDependency('test', 'org.springframework.boot', 'spring-boot-starter-test');
        it('Check that common info files exist', function () {
            assert.fileContent('src/main/java/io/swagger/Info.java', 'http://localhost:8080/swagger/api'); //standard info is there
        });
    }
}

module.exports = exports = AssertBFF;
