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
const constant = require('../../test/lib/constant');
const kube = require('../../test/lib/test-kube');
const liberty = require('@arf/generator-liberty');
const tests = require('@arf/java-common');

class AssertTechnologies extends Assert {
    constructor({ appName, buildType, frameworkType }) {
        super({ appName: appName, buildType: buildType, frameworkType: frameworkType });
        this.assertTech = new liberty.integrationAsserts.technologies();
    }

    assert() {
        super.assert();
        this.assertTech.assert(this.appName);
        tests.test(this.buildType).assertApplication(this.appName, constant.GROUPID, constant.ARTIFACTID, constant.VERSION);
    }

    // this is the default assertion for a technology type that just delegates to the Liberty checker,
    // override with a local assert<Tech> function to perform additional checks
    defaultAssertTech(type) {
        this.assertTech['assert' + type](this.buildType);
    }

    assertpicnmix() {
        this.assert();  // there are no additional files to check for
    }

    assertNoKube() {
        kube.test(this.appName, false, constant.FRAMEWORK_LIBERTY, 'picnmix');
    }

    assertmsbuilderwithname() {
        this.assertTech.assertmsbuilderwithname(this.appName);
    }
}

module.exports = exports = AssertTechnologies;
