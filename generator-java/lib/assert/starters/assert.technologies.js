/*
 * © Copyright IBM Corp. 2017, 2018
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

'use strict'

const Assert = require('../internal/assert.core')
const kube = require('../internal/assert.kube')
const constant = require('../constant')
const liberty = require('generator-ibm-java-liberty')
const tests = require('ibm-java-codegen-common')

class AssertTechnologies extends Assert {
  constructor ({appName, buildType, frameworkType}) {
    super()
    this.appName = appName
    this.buildType = buildType
    this.frameworkType = frameworkType
    this.assertTech = new liberty.integrationAsserts.technologies()
  }

  assert () {
    super.assert(this.appName, this.buildType, this.frameworkType)
    this.assertTech.assert(this.appName)
    tests.test(this.buildType).assertApplication(this.appName, constant.GROUPID, constant.ARTIFACTID, constant.VERSION)
  }

  // this is the default assertion for a technology type that just delegates to the Liberty checker,
  // override with a local assert<Tech> function to perform additional checks
  defaultAssertTech (type) {
    this.assertTech['assert' + type](this.buildType)
  }

  assertpicnmix () {
    this.assert()  // there are no additional files to check for
  }

  assertmsbuilderwithname () {
    this.assertTech.assertmsbuilderwithname(this.appName)
  }

  assertNoKube () {
    kube.test(this.appName, false, constant.FRAMEWORK_LIBERTY, 'picnmix')
  }
}

module.exports = exports = AssertTechnologies
