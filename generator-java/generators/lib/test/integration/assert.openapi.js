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

const AssertBx = require('../core.assertbx');
const constant = require('../constant');
const framework = require('../test-framework');
const tests = require('@arf/java-common');

class AssertOpenAPI extends AssertBx {
    assert(appName, ymlName, buildType, createType, frameworkType, exampleName, openApiServers, noHealth) {
        super.assert(appName, ymlName, buildType, frameworkType, createType, false, false);
        this.assertToolchainBxCreate();
        framework.test(frameworkType).assertOpenApi(openApiServers !== undefined, [exampleName], buildType, noHealth);
    }

    assertliberty({ buildType, createType }) {
        super.assertliberty();
        const test = tests.test(buildType);
        if (createType === 'microservice/liberty') {
            test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.1.18');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.18');
            const type = buildType === 'maven' ? 'pom' : undefined;
            test.assertDependency('provided', 'org.eclipse.microprofile', 'microprofile', '1.2', undefined, type);
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('microprofile-1.2');
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jndi-1.0');
        }
        if (createType === 'bff/liberty') {
            test.assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
            test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('apiDiscovery-1.0');
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
            framework.test(constant.FRAMEWORK_LIBERTY).assertConfig(true, 'basicRegistry');
        }
        if (createType === 'blank/liberty') {
            framework.test(constant.FRAMEWORK_LIBERTY).assertSourceFiles(true);
        } else {
            framework.test(constant.FRAMEWORK_LIBERTY).assertSourceFiles(false);
        }
    }
}

module.exports = exports = AssertOpenAPI;
