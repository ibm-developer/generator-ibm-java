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

const Assert = require('./assert.core')
const kube = require('./assert.kube')
const constant = require('../constant')
const framework = require('../assert.framework')
const assert = require('yeoman-assert')
const fs = require('fs')
const path = require('path')
const yml = require('js-yaml')
const tests = require('../../../lib/common')

class AssertBx extends Assert {
  getCheck (exists) {
    return {
      file: exists ? assert.file : assert.noFile,
      desc: exists ? 'should create ' : 'should not create ',
      content: exists ? assert.fileContent : assert.noFileContent
    }
  }

  assert (appName, ymlName, buildType, frameworkType, createType, cloudant, objectStorage) {
    super.assert(appName, buildType, frameworkType, createType)
    this.assertCLI(appName)
    this.assertCommonBxFiles()
    this.assertManifestYml(ymlName, cloudant || objectStorage)
    this.assertCloudant({exists: cloudant, buildType: buildType, frameworkType: frameworkType})
    this.assertObjectStorage({exists: objectStorage, buildType: buildType, frameworkType: frameworkType})
    this.assertBluemixSrc(cloudant || objectStorage, frameworkType)
    framework.test(frameworkType).assertCloudant(cloudant)
    framework.test(frameworkType).assertObjectStorage(objectStorage)
    kube.test(appName, true, frameworkType, createType, cloudant, objectStorage)
  }

  // asserts that there are / are not source code files for bluemix
  assertBluemixSrc (exists, frameworkType) {
    const check = this.getCheck(exists)
    it(check.desc + 'source code files for bluemix using service enablement generator', function () {
      if(frameworkType === constant.FRAMEWORK_LIBERTY) {
        check.file('src/main/java/application/ibmcloud/CloudServicesException.java')
        check.file('src/main/java/application/ibmcloud/CloudServices.java')
      }
    })
  }

  // asserts that files required for the CLI are present and correct
  assertCLI (appname) {
    const check = this.getCheck(true)
    it('files required for the CLI are present and correct', function () {
      check.content(constant.CLI_CONFIG_YML, 'image-name-run : "' + appname.toLowerCase() + '"') // make sure lowercase app name
      check.content(constant.CLI_CONFIG_YML, 'version : ' + constant.CLI_VERSION)
      check.content(constant.CLI_CONFIG_YML, 'chart-path : "chart/' + appname.toLowerCase() + '"')
    })
  }

  assertCloudant ({exists, buildType, frameworkType}) {
    if (exists) {
      it('should create Cloudant README entry', function () {
        assert.fileContent('README.md', 'cloudant')
      })
      it('should create file ' + constant.LOCALDEV_FILE + ' with Cloudant credentials', function () {
        assert.fileContent(constant.LOCALDEV_FILE, '"cloudant_username": "user"')
        assert.fileContent(constant.LOCALDEV_FILE, '"cloudant_password": "pass"')
        assert.fileContent(constant.LOCALDEV_FILE, '"cloudant_url": "https://account.cloudant.com"')
      })
      if(frameworkType === constant.FRAMEWORK_LIBERTY) {
        tests.test(buildType).assertDependency('compile', 'com.cloudant', 'cloudant-client', '2.7.0')
      }
      if(frameworkType === constant.FRAMEWORK_SPRING) {
        tests.test(buildType).assertDependency('compile', 'com.cloudant', 'cloudant-spring-boot-starter', '0.0.2')
      }
    }
  }

  assertCommonBxFiles () {
    it('should create common Bx files are present for all configurations', function () {
      // Docker files
      assert.file('Dockerfile-tools')
      assert.noFile('Dockerfile-run') // deprecated name
      // Bluemix files
      assert.file('manifest.yml')
      assert.file('.bluemix/deploy.json')
      assert.file('.bluemix/pipeline.yml')
      assert.file(constant.TOOLCHAIN_YML)
      assert.file('manifests/kube.deploy.yml')
    })
  }

  // asserts all files exist relative to a given base location
  assertFiles (base, exists) {
    if (arguments.length < 3) {
      throw 'assertFiles error : requires at least 3 arguments, base, exists and a file to check'
    }
    const check = this.getCheck(exists)
    for (let i = 2; i < arguments.length; i++) {
      if (arguments[i] && typeof arguments[i] === 'string') {
        const name = arguments[i]
        it(check.desc + 'file ' + name, function () {
          check.file(path.join(base, name))
        })
      }
    }
  }

  assertManifestYml (ymlName, exists) {
    it('manifest yml contains application name ' + ymlName, function () {
      assert.fileContent('manifest.yml', 'name: ' + ymlName)
    })
    const check = this.getCheck(exists)
    it(check.desc + 'manifest yml service entries', function () {
      check.content('manifest.yml', 'services:')
      // TODO: check for route
      check.content('manifest.yml', 'host: host')
      check.content('manifest.yml', 'domain: mybluemix.net')
    })
  }

  assertObjectStorage ({exists, buildType}) {
    const check = this.getCheck(exists)
    it(check.desc + 'Object Storage README entry', function () {
      if (exists) {
        check.content('README.md', 'Object Storage service')
      }
    })
    if (exists) {
      it('should create Object Storage README entry', function () {
        assert.fileContent('README.md', 'Object Storage service')
      })
      it('should create file ' + constant.LOCALDEV_FILE + ' with Object Storage credentials', function () {
        assert.fileContent(constant.LOCALDEV_FILE, '"object_storage_project": "objectStorage-project"')
        assert.fileContent(constant.LOCALDEV_FILE, '"object_storage_userId": "objectStorage-userId"')
        assert.fileContent(constant.LOCALDEV_FILE, '"object_storage_password": "objectStorage-password"')
        assert.fileContent(constant.LOCALDEV_FILE, '"object_storage_auth_url": "objectStorage-url"')
        assert.fileContent(constant.LOCALDEV_FILE, '"object_storage_domainName": "objectStorage-domainName"')
      })
      tests.test(buildType).assertDependency('compile', 'org.pacesys', 'openstack4j-core', '3.0.3')
      tests.test(buildType).assertDependency('compile', 'org.pacesys.openstack4j.connectors', 'openstack4j-httpclient', '3.0.3')
    }
  }

  // assert that the toolchain contains the bx create specific commands
  assertToolchainBxCreate () {
    let data;
    it('generates a cli-config.yml file', function () {
      assert.file(constant.TOOLCHAIN_YML)
      data = yml.safeLoad(fs.readFileSync(constant.TOOLCHAIN_YML, 'utf8'))
    })
    it('generates the correct value for repo.parameters.type', function () {
      const expectedValue = 'clone'
      assert.strictEqual(data.services.repo.parameters.type, expectedValue, `type has wrong value '${data.services.repo.parameters.type}' it should be '${expectedValue}'`)
    })
  }

  // assert that the toolchain contains the bx enable specific commands
  assertToolchainBxEnable () {
    let data;
    it('generates a cli-config.yml file', function () {
      assert.file(constant.TOOLCHAIN_YML)
      data = yml.safeLoad(fs.readFileSync(constant.TOOLCHAIN_YML, 'utf8'))
    })
    it('generates the correct value for repo.parameters.type', function () {
      const expectedValue = 'link'
      assert.strictEqual(data.services.repo.parameters.type, expectedValue, `type has wrong value '${data.services.repo.parameters.type}' it should be '${expectedValue}'`)
    })
  }
}

module.exports = exports = AssertBx
