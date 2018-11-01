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
const example = require('../resources/openapi/basicswagger.json')
const example1 = require('../resources/openapi/basicswagger1.json')
const PROP_FILE = 'src/main/resources/application.properties'

function AssertOpenApi () {
  this.assert = function (exists, examples, buildType) {
    this.assertHealthFiles()
    this.assertCommon(exists, examples, buildType)
  }

  this.assertHealthFiles = function () {
    it('check health endpoint file is generated', function () {
      assert.file('src/main/java/application/rest/HealthEndpoint.java')
    })
  }

  this.assertCommon = function (exists, examples, buildType) {
    const check = exists ? assert.file : assert.noFile
    const checkContents = exists ? assert.fileContent : assert.noFileContent
    const desc = exists ? 'creates ' : 'does not create '
    const contentDesc = exists ? ' contains ' : ' does not contain '
    it(desc + 'core openapi files', function () {
      check([
        'src/main/java/io/swagger/RFC3339DateFormat.java',
        'src/main/java/io/swagger/configuration/SwaggerDocumentationConfig.java',
        'src/main/java/application/NotFoundException.java',
        'src/main/java/application/ApiResponseMessage.java',
        'src/main/java/application/ApiOriginFilter.java',
        'src/main/java/application/ApiException.java'
      ])
    })
    if (examples.includes('example')) {
      it(desc + 'example openapi files', function () {
        check([
          'src/main/java/application/model/User.java',
          'src/main/java/application/model/Tag.java',
          'src/main/java/application/model/Pet.java',
          'src/main/java/application/model/Order.java',
          'src/main/java/application/model/ModelApiResponse.java',
          'src/main/java/application/model/Category.java',
          'src/main/java/application/UserApiController.java',
          'src/main/java/application/UserApi.java',
          'src/main/java/application/StoreApiController.java',
          'src/main/java/application/StoreApi.java',
          'src/main/java/application/PetApiController.java',
          'src/main/java/application/PetApi.java',
        ])
      })
    }
    if (examples.includes('example1')) {
      it(desc + 'example1 openapi files', function () {
        check([
          'src/main/java/application/model/Pet1.java',
          'src/main/java/application/Pets1ApiController.java',
          'src/main/java/application/Pets1Api.java',
        ])
      })
    }

    it('check ' + PROP_FILE + contentDesc + 'spring fox and spring jackson settings', function () {
      checkContents(PROP_FILE, 'springfox.documentation.swagger.v2.path=/swagger/api')
      checkContents(PROP_FILE, 'spring.jackson.date-format=io.swagger.RFC3339DateFormat')
      checkContents(PROP_FILE, 'spring.jackson.serialization.WRITE_DATES_AS_TIMESTAMPS=false')
    })
    const checkDependency = exists ? tests.test(buildType).assertDependency : tests.test(buildType).assertNoDependency
    checkDependency('compile', 'io.springfox', 'springfox-swagger2', '2.7.0')
    checkDependency('compile', 'io.springfox', 'springfox-swagger-ui', '2.7.0')
    checkDependency('compile', 'com.fasterxml.jackson.datatype', 'jackson-datatype-joda')
    checkDependency('compile', 'javax.validation', 'validation-api')
  }

  this.getExample = function () {
    return {name: 'example', value: example}
  }

  this.getExample1 = function () {
    return {name: 'example1', value: example1}
  }
}

module.exports = exports = AssertOpenApi
