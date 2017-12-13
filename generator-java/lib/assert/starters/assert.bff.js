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

'use strict'

const AssertBx = require('../internal/assert.core.bx')
const constant = require('../constant')
const framework = require('../assert.framework')
const assert = require('yeoman-assert')
const tests = require('ibm-java-codegen-common')

class AssertBFF extends AssertBx {
  assert (appName, ymlName, buildType, frameworkType, createType, cloudant, objectStorage) {
    super.assert(appName, ymlName, buildType, frameworkType, createType, cloudant, objectStorage)
    framework.test(frameworkType).assertSourceFiles(false)
  }

  assertliberty ({buildType}) {
    super.assertliberty()
    this.assertFiles('src', true,
      'main/java/application/rest/SwaggerEndpoint.java',
      'main/java/application/model/Product.java',
      'main/java/application/openapi/ProductsApi.java',
      'main/java/application/openapi/ProductApi.java',
      'test/java/it/ProductsEndpointTest.java',
      'test/java/it/SwaggerEndpointTest.java')
    framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0')
    framework.test(constant.FRAMEWORK_LIBERTY).assertFeatures('apiDiscovery-1.0')
    framework.test(constant.FRAMEWORK_LIBERTY).assertConfig(true, 'basicRegistry')
    const test = tests.test(buildType)
    test.assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3')
    test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1')
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18')
  }

  assertspring ({buildType}) {
    super.assertspring()
    this.assertFiles('src', true,
      'main/java/io/swagger/api/ProductApi.java',
      'main/java/io/swagger/api/ProductApiController.java',
      'main/java/io/swagger/api/ProductsApi.java',
      'main/java/io/swagger/api/ProductsApiController.java',
      'main/java/io/swagger/model/Product.java')
    framework.test(constant.FRAMEWORK_SPRING).assertOpenApi(true, [], buildType)
    framework.test(constant.FRAMEWORK_SPRING).assertContent('/index.html')
    framework.test(constant.FRAMEWORK_SPRING).assertContent('/error/404.html')
    const test = tests.test(buildType)
    test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web')
    test.assertDependency('compile', 'org.springframework.boot', 'spring-boot-actuator')
    test.assertDependency('compile', 'org.springframework.cloud', 'spring-cloud-starter-hystrix')
    test.assertDependency('test', 'org.springframework.boot', 'spring-boot-starter-test')
    it('Check that common info files exist', function () {
      assert.fileContent('src/main/java/io/swagger/Info.java', 'http://localhost:8080/swagger/api') // standard info is there
    })
  }
}

module.exports = exports = AssertBFF
