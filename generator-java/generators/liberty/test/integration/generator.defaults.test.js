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
 * Tests the technology aspect of the generator
 */
'use strict'
const path = require('path')
const helpers = require('yeoman-test')
const AssertTech = require('../../lib/assert.technologies')
const AssertLiberty = require('../../lib/assert.liberty')
const common = require('../../../lib/common')

class TechOptions extends AssertTech {
  constructor (buildType) {
    super()
    this.conf = {
      createType: 'picnmix',
      buildType: buildType,
      appName: 'testAppName'
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

class LibertyOptions extends AssertLiberty {
  constructor (buildType) {
    super()
    this.conf = {
      headless: 'true',
      debug: 'true',
      createType: 'picnmix',
      buildType: buildType
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

describe('java liberty generator : defaults integration test', function () {
  describe('Generates a project with default technologies', function () {
    const options = new TechOptions('maven')
    before(options.before.bind(options))
    options.assertrest('maven')
  })
  describe('Generates a project with default technologies', function () {
    const options = new LibertyOptions('maven')
    before(options.before.bind(options))
    options.assertPlatforms([], 'maven', 'testAppName')
  })

})
