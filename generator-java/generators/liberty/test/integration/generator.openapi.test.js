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
const AssertOpenApi = require('../../lib/assert.openapi')
const common = require('../../../../lib/common')
const openapidoc = require('../../resources/openapi/basicswagger.json')
const openapidoc1 = require('../../resources/openapi/basicswagger1.json')

const ARTIFACTID = 'artifact.0.1'
const GROUPID = 'test.group'
const VERSION = '1.0.0'
const APPNAME = 'testApp'

class Options extends AssertOpenApi {

  constructor (buildType, createType, bluemix) {
    super()
    this.conf = {
      buildType: buildType,
      createType: createType,
      appName: APPNAME,
      groupId: GROUPID,
      artifactId: ARTIFACTID,
      version: VERSION
    }
    if (bluemix) {
      this.conf.bluemix = bluemix
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

describe('java liberty generator : Liberty server integration test', function () {
  this.timeout('40000')
  buildTypes.forEach(buildType => {
    describe('generate project without openapi code with buildType ' + buildType, function () {
      const bluemix = {
        'backendPlatform': 'JAVA'
      }
      const options = new Options(buildType, 'basic/liberty', bluemix)
      before(options.before.bind(options))
      options.assert(false, [])
    })
    describe('generate project with openapi code with buildType ' + buildType, function () {
      const bluemix = {
        'backendPlatform': 'JAVA',
        'openApiServers': [
          {
            'spec': JSON.stringify(openapidoc)
          }
        ]
      }
      const options = new Options(buildType, 'basic/liberty', bluemix)
      before(options.before.bind(options))
      options.assert(true, ['example'])
    })
    describe('generate project with two identical openapi code docs with buildType ' + buildType, function () {
      const bluemix = {
        'backendPlatform': 'JAVA',
        'openApiServers': [
          {
            'spec': JSON.stringify(openapidoc)
          },
          {
            'spec': JSON.stringify(openapidoc)
          }
        ]
      }
      const options = new Options(buildType, 'basic/liberty', bluemix)
      before(options.before.bind(options))
      options.assert(true, ['example'])
    })
    describe('generate project with two different openapi code docs with buildType ' + buildType, function () {
      const bluemix = {
        'backendPlatform': 'JAVA',
        'openApiServers': [
          {
            'spec': JSON.stringify(openapidoc)
          },
          {
            'spec': JSON.stringify(openapidoc1)
          }
        ]
      }
      const options = new Options(buildType, 'basic/liberty', bluemix)
      before(options.before.bind(options))
      options.assert(true, ['example', 'example1'])
    })
  })
})
