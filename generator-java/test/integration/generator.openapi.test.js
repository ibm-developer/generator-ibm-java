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

const testAsserts = require('../../index').testAsserts;
const AssertOpenAPI = testAsserts.starters.openapi;
const constant = testAsserts.constant;
const framework = testAsserts.framework;
const core = require('../lib/core');
const assert = require('yeoman-assert');
const extend = require('extend');

class Options extends core.Options {
  constructor(runHeadless, buildType, type, frameworkType, openApiServers) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless: runHeadless.toString(),
      buildType: buildType,
      frameworkType: frameworkType || constant.FRAMEWORK_LIBERTY,
      createType: type + '/' + (frameworkType || constant.FRAMEWORK_LIBERTY),
      appName: constant.APPNAME
    });
    if (openApiServers) {
      this.values.bluemix.openApiServers = openApiServers;
    }
  }
}

const gradle = 'gradle';
const maven = 'maven';
const assertOpenApi = new AssertOpenAPI();

execute(constant.FRAMEWORK_LIBERTY);
execute(constant.FRAMEWORK_SPRING);

function execute(frameworkType) {
  const name = frameworkType.toUpperCase();

  describe('java generator : microservice integration test', function () {
    this.timeout(30000);

    // execute each of these tests for both Liberty and Spring frameworks
    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), gradle build system with prompts', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(false, gradle, 'microservice', frameworkType, openApiServers);
      options.prompts = { extName: 'prompt:patterns', buildType: gradle, createType: 'microservice/' + frameworkType, services: ['none'], appName: constant.APPNAME, artifactId: constant.ARTIFACTID };
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, gradle, options.values.createType, frameworkType, example.name, openApiServers);
      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', gradle);
        assert.noFileContent('README.md', maven);
      });
    });

    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), maven build system with prompts', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(false, maven, 'microservice', frameworkType, openApiServers);
      options.prompts = { extName: 'prompt:patterns', buildType: maven, createType: 'microservice/' + frameworkType, services: ['none'], appName: constant.APPNAME, artifactId: constant.ARTIFACTID };
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, maven, options.values.createType, frameworkType, example.name, openApiServers);
      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', maven);
        assert.noFileContent('README.md', gradle);
      });
    });

    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), gradle build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(true, gradle, 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, gradle, options.values.createType, frameworkType, example.name, openApiServers);
      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', gradle);
        assert.noFileContent('README.md', maven);
      });
    });

    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), maven build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(true, maven, 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, maven, options.values.createType, frameworkType, example.name, openApiServers);
      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', maven);
        assert.noFileContent('README.md', gradle);
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
      const options = new Options(true, gradle, 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, gradle, options.values.createType, frameworkType, example.name, openApiServers);
      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', gradle);
        assert.noFileContent('README.md', maven);
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
      const options = new Options(true, maven, 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, maven, options.values.createType, frameworkType, example.name, openApiServers);
      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java', 'list.add("Congratulations, your application is up and running");'); // check no bx services present
        assert.fileContent('README.md', maven);
        assert.noFileContent('README.md', gradle);
      });
    });

    describe(name + ': Generates a basic bff project using open api doc (no bluemix), gradle build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(true, gradle, 'bff', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, gradle, options.values.createType, frameworkType, example.name, openApiServers);
    });

    describe(name + ': Generates a basic bff project using open api doc (no bluemix), maven build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(true, maven, 'bff', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, maven, options.values.createType, frameworkType, example.name, openApiServers);
    });

    describe(name + ': Generates a blank project using open api doc (no bluemix), gradle build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(true, gradle, 'blank', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, gradle, options.values.createType, frameworkType, example.name, openApiServers, true);
    });

    describe(name + ': Generates a blank project using open api doc (no bluemix), maven build system', function () {
      const example = framework.test(frameworkType).getExampleOpenApi()
      const openApiServers = [
        {
          "spec": JSON.stringify(example.value)
        }
      ];
      const options = new Options(true, maven, 'blank', frameworkType, openApiServers);
      before(options.before.bind(options));
      assertOpenApi.assert(options.values.appName, options.values.appName, maven, options.values.createType, frameworkType, example.name, openApiServers, true);
    });
  });
}
