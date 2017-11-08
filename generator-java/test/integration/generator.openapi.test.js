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
* Tests the microservice generator
*/

'use strict';

const AssertOpenAPI = require('../../generators/lib/assert.openapi');
const assert = require('yeoman-assert');
const constant = require('../lib/constant');
const core = require('../lib/core');
const extend = require('extend');
const framework = require('../lib/test-framework');

class Options extends core.BxOptions {
  constructor(buildType, type, frameworkType, openApiServers) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless: "true",
      buildType: buildType,
      frameworkType: frameworkType || constant.FRAMEWORK_LIBERTY,
      createType: type + '/' + (frameworkType || constant.FRAMEWORK_LIBERTY),
      appName: core.APPNAME
    });
    if (openApiServers) {
      this.values.bluemix.openApiServers = openApiServers;
    }
  }
}

const gradle = 'gradle';
const maven = 'maven';

execute(constant.FRAMEWORK_LIBERTY);
execute(constant.FRAMEWORK_SPRING);

function execute(frameworkType) {
  const name = frameworkType.toUpperCase();
  const backendPlatform = frameworkType === 'liberty' ? 'JAVA' : 'SPRING';

  describe('java generator : microservice integration test', function () {
    this.timeout(30000);

    // execute each of these tests for both Liberty and Spring frameworks
    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), gradle build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('gradle', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: gradle,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();

      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', 'gradle');
        assert.noFileContent('README.md', 'maven');
      });
    });

    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), maven build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('maven', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: maven,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();

      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', 'maven');
        assert.noFileContent('README.md', 'gradle');
      });
    });

    describe(name + ': Generates a basic microservices project using two identical open api doc (no bluemix), gradle build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }, {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('gradle', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: gradle,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();

      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', 'gradle');
        assert.noFileContent('README.md', 'maven');
      });
    });

    describe(name + ': Generates a basic microservices project using two identical open api doc (no bluemix), maven build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }, {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('maven', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: maven,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();

      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', 'maven');
        assert.noFileContent('README.md', 'gradle');
      });
    });

    describe(name + ': Generates a basic bff project using open api doc (no bluemix), gradle build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('gradle', 'bff', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: gradle,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();
    });

    describe(name + ': Generates a basic bff project using open api doc (no bluemix), maven build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('maven', 'bff', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: maven,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();
    });

    describe(name + ': Generates a blank project using open api doc (no bluemix), gradle build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('gradle', 'blank', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: gradle,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        noHealth: true,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();
    });

    describe(name + ': Generates a blank project using open api doc (no bluemix), maven build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options('maven', 'blank', frameworkType, openApiServers);
      before(options.before.bind(options));

      const assertOpenApi = new AssertOpenAPI({
        appName: constant.APPNAME,
        buildType: maven,
        createType: options.values.createType,
        exampleName: example.name,
        frameworkType: frameworkType,
        noHealth: true,
        openApiServers: openApiServers,
        ymlName: constant.APPNAME
      });
      assertOpenApi.assert();
      assertOpenApi.assertCompiles();
    });
  });
}
