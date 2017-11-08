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
const common = require('../../test/lib/test-common');
const constant = require('../../test/lib/constant');
const framework = require('../../test/lib/test-framework');
const tests = require('@arf/java-common');

class AssertOpenAPI extends AssertBx {
    constructor({ appName, buildType, createType, exampleName, frameworkType, noHealth, openApiServers, ymlName }) {
        super({
            appName: appName,
            buildType: buildType,
            cloudant: false,
            createType: createType,
            frameworkType: frameworkType,
            objectStorage: false,
            ymlName: ymlName
        });
        this.exampleName = exampleName;
        this.noHealth = noHealth;
        this.openApiServers = openApiServers;
    }

    assert() {
        super.assert();
        common.assertToolchainBxCreate();
        framework.test(this.frameworkType).assertOpenApi(this.openApiServers !== undefined, [this.exampleName], this.buildType, this.noHealth);
    }

    assertliberty() {
        super.assertliberty();
        const test = tests.test(this.buildType);
        if (this.createType === 'microservice/liberty') {
            test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
            const type = this.buildType === 'maven' ? 'pom' : undefined;
            test.assertDependency('provided', 'io.microprofile', 'microprofile', '1.0.0', undefined, type);
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('microprofile-1.0');
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jndi-1.0');
        }
        if (this.createType === 'bff/liberty') {
            test.assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
            test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
            test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('apiDiscovery-1.0');
            framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
            framework.test(constant.FRAMEWORK_LIBERTY).assertConfig(true, 'basicRegistry');
        }
        if (this.createType === 'blank/liberty') {
            framework.test(constant.FRAMEWORK_LIBERTY).assertSourceFiles(true);
        } else {
            framework.test(constant.FRAMEWORK_LIBERTY).assertSourceFiles(false);
        }
    }
}

module.exports = exports = AssertOpenAPI;
