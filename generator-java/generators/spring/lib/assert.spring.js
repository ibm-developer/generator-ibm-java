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

/**
 * Provides the assertions for testing Liberty code and config from this generator
 */
'use strict'

const assert = require('yeoman-assert')
const tests = require('../../../lib/common')

const SPRING_VERSION = '1.5.15.RELEASE'   //current Spring version to check for
const LOCAL_APP_PROPS = 'src/main/resources/application-local.properties'
const APP_PROPS = 'src/main/resources/application.properties'
const CONTENT_ROOT = 'src/main/resources/public'   //where public web content is served from

//handy function for checking both existence and non-existence
function getCheck (exists) {
  return {
    file: exists ? assert.file : assert.noFile,
    desc: exists ? 'should create ' : 'should not create ',
    content: exists ? assert.fileContent : assert.noFileContent
  }
}

function getBuildCheck (exists, buildType) {
  return {
    content: exists ? tests.test(buildType).assertContent : tests.test(buildType).assertNoContent
  }
}

function AssertSpring () {
  this.assertAllFiles = function (exists) {
    const check = getCheck(exists)
    it(check.desc + 'server specific files - application-local.properties', function () {
      check.file(LOCAL_APP_PROPS)
    })
    it(check.desc + 'server specific files - application.properties', function () {
      check.file(APP_PROPS)
    })
  }

  this.assertArtifactID = function (buildType, id) {
    const check = getBuildCheck(true, buildType)
    if (buildType === 'gradle') {
      it('settings.gradle contains root project setting of ' + id, function () {
        assert.fileContent('settings.gradle', 'rootProject.name = \'' + id + '\'')
      })
    }
    if (buildType === 'maven') {
      check.content('<artifactId>' + id + '</artifactId>')
    }
  }

  this.assertVersion = function (buildType) {
    describe('contains Spring version ' + SPRING_VERSION, function () {
      const check = getBuildCheck(true, buildType)
      if (buildType === 'gradle') {
        check.content('org.springframework.boot:spring-boot-gradle-plugin:' + SPRING_VERSION)
      }
      if (buildType === 'maven') {
        const groupId = 'org\\.springframework\\.boot'
        const artifactId = 'spring-boot-starter-parent'
        const version = SPRING_VERSION.replace(/\./g, '\\.')
        const content = '<parent>\\s*<groupId>' + groupId + '</groupId>\\s*<artifactId>' + artifactId + '</artifactId>\\s*<version>' + version + '</version>\\s*</parent>'
        const regex = new RegExp(content)
        check.content(regex)
      }
    })
  }

  this.assertEnv = function (exists, name, value) {
    const check = getCheck(exists)
    it(check.desc + 'an application-local.properties entry for ' + name + ' = ' + value, function () {
      check.content(LOCAL_APP_PROPS, name + '="' + value + '"')
    })
  }

  this.assertContent = function (exists, path) {
    const check = getCheck(exists)
    it(check.desc + 'content at ' + path, function () {
      check.file(CONTENT_ROOT + path)
    })
  }

  this.assertJavaMetrics = function(exists, buildType) {
    const check = getCheck(exists)
    describe(check.desc + 'javametrics dependencies', function() {
      const depcheck = exists ? tests.test(buildType).assertDependency : tests.test(buildType).assertNoDependency
      depcheck('compile', 'com.ibm.runtimetools', 'javametrics-agent', '\\[1.1,2.0\\)')
      depcheck('compile', 'com.ibm.runtimetools', 'javametrics-spring', '\\[1.1,2.0\\)')
      depcheck('compile', 'org.glassfish', 'javax.json', '1.0.4')
    })
  }
}

module.exports = exports = AssertSpring
