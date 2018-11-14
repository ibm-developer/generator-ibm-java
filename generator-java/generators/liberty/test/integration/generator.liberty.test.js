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
 * Tests the Liberty aspects generator
 */

'use strict'

const path = require('path')
const helpers = require('yeoman-test')
const AssertLiberty = require('../../lib/assert.liberty')
const common = require('../../../../lib/common')

const ARTIFACTID = 'artifact'
const GROUPID = 'test.group'
const VERSION = '1.0.0'
const APPNAME = 'testApp'

class Options extends AssertLiberty {
  constructor(buildType, createType, platforms, jndiEntries, envEntries, frameworkDependencies, javametrics, libertyVersion) {
    super()
    this.conf = {
      buildType: buildType,
      createType: createType,
      javametrics: javametrics,
      platforms: platforms,
      technologies: [],
      jndiEntries: jndiEntries,
      envEntries: envEntries,
      frameworkDependencies: frameworkDependencies,
      appName: APPNAME,
      groupId: GROUPID,
      artifactId: ARTIFACTID,
      version: VERSION,
      libertyVersion: libertyVersion
    }
    const ctx = new common.context('test', this.conf)
    this.options = {
      context: ctx
    }
    this.before = function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withOptions(this.options)
        .toPromise()
    }
  }
}

const buildTypes = ['gradle', 'maven']
const platforms = [
  [],
  ['bluemix']
]
const jndiEntries = [{
  name: 'jndiName',
  value: 'jndiValue'
}]
const envEntries = [{
  name: 'envName',
  value: 'envValue'
}]
const frameworkDependencies = [{
  'feature': 'testfeature'
}]

describe('java liberty generator : Liberty server integration test', function () {
  buildTypes.forEach(buildType => {
    platforms.forEach(platformArray => {
      describe('Generates server configuration (no technologies) ' + buildType + ' with platforms ' + platformArray, function () {
        const options = new Options(buildType, 'picnmix', platformArray, jndiEntries, envEntries, frameworkDependencies, false)
        before(options.before.bind(options))
        options.assertAllFiles(true)
        options.assertJavaMetrics(false, buildType)
        options.assertContextRoot()
        options.assertVersion(buildType)
        options.assertProperties(buildType)
        options.assertPlatforms(platformArray, buildType, APPNAME)
        options.assertNotLoose(buildType)
        jndiEntries.forEach(entry => {
          options.assertJNDI(true, entry.name, entry.value)
        })
        envEntries.forEach(entry => {
          options.assertEnv(true, entry.name, entry.value)
        })
        frameworkDependencies.forEach(entry => {
          options.assertFeature(true, entry.feature)
        })
      })
    })

    describe('Check artifact id for ' + buildType, function () {
      const options = new Options(buildType, 'picnmix', [], jndiEntries, envEntries, frameworkDependencies, false)
      before(options.before.bind(options))
      options.assertArtifactID(buildType, options.conf.artifactId)
    })

    describe('Generates correct build config when libertyVersion is set to beta', function () {
      const options = new Options(buildType, 'picnmix', [], jndiEntries, envEntries, frameworkDependencies, false, 'beta')
      before(options.before.bind(options))
      options.assertVersion(buildType, 'beta')
    })
  })
})

describe('Generates server configuration (no technologies) maven with deploy type with java metrics', function () {
  const options = new Options('maven', 'picnmix', [], jndiEntries, envEntries, frameworkDependencies, true)
  before(options.before.bind(options))
  options.assertAllFiles(true)
  options.assertJavaMetrics(true, 'maven')
})