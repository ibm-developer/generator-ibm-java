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

const Assert = require('./core.assert');
const assert = require('yeoman-assert');
const constant = require('./constant');
const framework = require('./test-framework');
const fs = require('fs');
const kube = require('./test-kube');
const path = require('path');
const tests = require('@arf/java-common');
const yml = require('js-yaml');

class AssertBx extends Assert {
    getCheck(exists) {
        return {
            file: exists ? assert.file : assert.noFile,
            desc: exists ? 'should create ' : 'should not create ',
            content: exists ? assert.fileContent : assert.noFileContent
        }
    }

    assert(appName, ymlName, buildType, frameworkType, createType, cloudant, objectStorage) {
        super.assert(appName, buildType, frameworkType, createType);
        this.assertCLI(appName);
        this.assertCommonBxFiles();
        this.assertManifestYml(ymlName, cloudant || objectStorage);
        this.assertCloudant({ exists: cloudant, buildType: buildType, frameworkType: frameworkType });
        this.assertObjectStorage({ exists: objectStorage, buildType: buildType, frameworkType: frameworkType });
        if (frameworkType === constant.FRAMEWORK_SPRING) this.assertBluemixSrcSvcEnabled(cloudant || objectStorage);
        if (frameworkType === constant.FRAMEWORK_LIBERTY) this.assertBluemixSrc(cloudant || objectStorage);
        framework.test(frameworkType).assertCloudant(cloudant);
        framework.test(frameworkType).assertObjectStorage(objectStorage);
        kube.test(appName, true, frameworkType, createType, cloudant, objectStorage);
    }

    // asserts that there are no source code files for bluemix
    assertBluemixSrc(exists) {
        var check = this.getCheck(exists);
        it(check.desc + 'source code files for bluemix', function () {
            check.file('src/main/java/application/bluemix/InvalidCredentialsException.java');
            check.file('src/main/java/application/bluemix/VCAPServices.java');
        });
    }

    // asserts that there are / are not source code files for bluemix
    assertBluemixSrcSvcEnabled(exists) {
        var check = this.getCheck(exists);
        it(check.desc + 'source code files for bluemix using service enablement generator', function () {
            check.file('src/main/java/application/ibmcloud/CloudServicesException.java');
            check.file('src/main/java/application/ibmcloud/CloudServices.java');
        });
    }

    // asserts that files required for the CLI are present and correct
    assertCLI(appname) {
        var check = this.getCheck(true);
        it('files required for the CLI are present and correct', function () {
            check.content(constant.CLI_CONFIG_YML, 'image-name-run : "' + appname.toLowerCase() + '"'); // make sure lowercase app name
            check.content(constant.CLI_CONFIG_YML, 'version : ' + constant.CLI_VERSION);
            check.content(constant.CLI_CONFIG_YML, 'chart-path : "chart/' + appname.toLowerCase() + '"');
        });
    }

    assertCloudant({ exists, buildType }) {
        const check = this.getCheck(exists);
        it(check.desc + 'cloudant README entry', function () {
            if (exists) {
                check.content('README.md', 'cloudant');
            }
        });
        if (exists) {
            tests.test(buildType).assertDependency('compile', 'com.cloudant', 'cloudant-client', '2.7.0');
        }
    }

    assertCommonBxFiles() {
        it('should create common Bx files are present for all configurations', function () {
            // Docker files
            assert.file('Dockerfile-tools');
            assert.noFile('Dockerfile-run'); // deprecated name
            // Bluemix files
            assert.file('manifest.yml');
            assert.file('.bluemix/deploy.json');
            assert.file('.bluemix/pipeline.yml');
            assert.file(constant.TOOLCHAIN_YML);
            assert.file('manifests/kube.deploy.yml');
        });
    }

    // asserts all files exist relative to a given base location
    assertFiles(base, exists) {
        if (arguments.length < 3) {
            throw "assertFiles error : requires at least 3 arguments, base, exists and a file to check";
        }
        var check = this.getCheck(exists);
        for (var i = 2; i < arguments.length; i++) {
            if (arguments[i] && typeof arguments[i] === 'string') {
                var name = arguments[i];
                it(check.desc + 'file ' + name, function () {
                    check.file(path.join(base, name));
                });
            }
        }
    }

    assertManifestYml(ymlName, exists) {
        it('manifest yml contains application name ' + ymlName, function () {
            assert.fileContent('manifest.yml', 'name: ' + ymlName);
        });
        var check = this.getCheck(exists);
        it(check.desc + 'manifest yml service entries', function () {
            check.content('manifest.yml', 'services:');
            check.content('manifest.yml', 'host: host');
            check.content('manifest.yml', 'domain: mybluemix.net');
        });
    }

    assertObjectStorage({ exists, buildType }) {
        const check = this.getCheck(exists);
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

    // assert that the toolchain contains the bx create specific commands
    assertToolchainBxCreate() {
        var data;
        it('generates a cli-config.yml file', function () {
            assert.file(constant.TOOLCHAIN_YML);
            data = yml.safeLoad(fs.readFileSync(constant.TOOLCHAIN_YML, 'utf8'));
        });
        it('generates the correct value for repo.parameters.type', function () {
            var expectedValue = 'clone';
            assert.strictEqual(data.repo.parameters.type, expectedValue, `type has wrong value '${data.repo.parameters.type}' it should be '${expectedValue}'`);
        });
    }

    // assert that the toolchain contains the bx enable specific commands
    assertToolchainBxEnable() {
        var data;
        it('generates a cli-config.yml file', function () {
            assert.file(constant.TOOLCHAIN_YML);
            data = yml.safeLoad(fs.readFileSync(constant.TOOLCHAIN_YML, 'utf8'));
        });
        it('generates the correct value for repo.parameters.type', function () {
            var expectedValue = 'link';
            assert.strictEqual(data.repo.parameters.type, expectedValue, `type has wrong value '${data.repo.parameters.type}' it should be '${expectedValue}'`);
        });
    }
}

module.exports = exports = AssertBx;
