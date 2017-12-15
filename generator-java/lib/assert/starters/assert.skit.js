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
 * Assertions for testing projects generated via the usercase generator
 */

'use strict'

const Assert = require('../internal/assert.core')
const framework = require('../assert.framework')
const assert = require('yeoman-assert')
const tests = require('ibm-java-codegen-common')

const liberty = 'liberty'
const spring = 'spring'
const gradle = 'gradle'
const maven = 'maven'

class AssertSkit extends Assert {
  assert (appName, buildType, frameworkType) {
    super.assert(appName, buildType, frameworkType)

    it('creates an README.mdfile', function () {
      assert.file('README.md')
    })

    this['assert' + buildType]()
    tests.test(buildType).assertProperty('testServerHttpPort', '9080')
  }

  assertliberty () {
    super.assertliberty()
    framework.test(liberty).assertFeatures('feature-1.0', 'jee-1.0')
    framework.test(liberty).assertJndi(true, {'cloudant/service': 'http://somehwere'})
    framework.test(liberty).assertEnv(true, {'ENV_VAR': 'some environment variable value'})
  }

  assertspring () {
    super.assertspring()
    framework.test(spring).assertEnv(true, {'ENV_VAR': 'some environment variable value'})
  }

  assertgradle () {
    if (this.frameworkType === liberty) {
      tests.test(gradle).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0')
    }
    if (this.assertFramework === spring) {
      tests.test(gradle).assertDependency('provided', 'org.springframework.boot', 'spring-boot-starter-data-mongodb', '1.5.6.RELEASE')
    }
  }

  assertmaven () {
    if (this.frameworkType === liberty) {
      tests.test(maven).assertDependency('provided', 'org.pacesys', 'openstack4j-core', '3.0.3')
    }
    if (this.assertFramework === spring) {
      tests.test(maven).assertDependency('provided', 'com.cloudant', 'cloudant-client', '2.7.0')
    }
  }
}

module.exports = exports = AssertSkit