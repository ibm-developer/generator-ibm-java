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

const FRAMEWORK_LIBERTY = 'liberty';
const FRAMEWORK_SPRING = 'spring';

const assert = require('yeoman-assert');
const framework = require('../lib/test-framework');
const tests = require('@arf/java-common');
const spring = require('@arf/generator-spring');
const core = require('../lib/core');
const extend = require('extend');
const common = require('../lib/test-common');
const command = tests.test('command');

class Options extends core.BxOptions {
  constructor(buildType, type, frameworkType, openApiServers) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless :  "true",
      buildType : buildType,
      frameworkType : frameworkType || FRAMEWORK_LIBERTY,
      createType : type + '/' + (frameworkType || FRAMEWORK_LIBERTY),
      appName : core.APPNAME
    });
    if(openApiServers) {
      this.values.bluemix.openApiServers = openApiServers;
    }
  }

  assert(appName, ymlName, exampleName, noHealth) {
    super.assert(appName, ymlName, false, false, this.values.createType);
    this.values.frameworkType === FRAMEWORK_LIBERTY ? this.assertliberty(noHealth) : this.assertspring();
    this.assertBuild(appName);
    common.assertToolchainBxCreate();
    framework.test(this.values.frameworkType).assertOpenApi(this.values.bluemix.openApiServers !== undefined, [exampleName], this.values.buildType, noHealth);
  }

  assertBuild(appName) {
    super.assertBuild(appName);
  }

  //Liberty specific things to test for
  assertliberty(noHealth) {
    super.assertliberty();
    var test = tests.test(this.values.buildType);
    if(this.values.createType === 'microservice/liberty') {
      test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
      test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.1.18');
      test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
      test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.18');
      var type = this.values.buildType === 'maven' ? 'pom' : undefined;
      test.assertDependency('provided', 'org.eclipse.microprofile', 'microprofile', '1.2', undefined, type);
      framework.test(FRAMEWORK_LIBERTY).assertFeatures('microprofile-1.2');
      framework.test(FRAMEWORK_LIBERTY).assertFeatures('jndi-1.0');
    }
    if(this.values.createType === 'bff/liberty') {
      test.assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
      test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
      test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
      framework.test(FRAMEWORK_LIBERTY).assertFeatures('apiDiscovery-1.0');
      framework.test(FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
      framework.test(FRAMEWORK_LIBERTY).assertConfig(true, 'basicRegistry');
    }
    if(this.values.createType === 'blank/liberty') {
      framework.test(FRAMEWORK_LIBERTY).assertSourceFiles(true);
    } else {
      framework.test(FRAMEWORK_LIBERTY).assertSourceFiles(false);
    }
  }

  assertspring() {
    super.assertspring();
  }

  assertCompiles() {
    command.run(tests.test(this.values.buildType).getCompileCommand());
  }
}


execute(FRAMEWORK_LIBERTY);
execute(FRAMEWORK_SPRING);

function execute(frameworkType) {
  const name = frameworkType.toUpperCase();
  const backendPlatform = frameworkType === 'liberty' ? 'JAVA' : 'SPRING';

  describe('java generator : microservice integration test', function () {
    this.timeout(30000);

    //execute each of these tests for both Liberty and Spring frameworks
    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), gradle build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('gradle', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name);
      options.assertCompiles();

      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Congratulations, your application is up and running");'); //check no bx services present
        assert.fileContent('README.md', 'gradle');
        assert.noFileContent('README.md', 'maven');
      });
    });

    describe(name + ': Generates a basic microservices project using open api doc (no bluemix), maven build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('maven', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name);
      options.assertCompiles();

      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Congratulations, your application is up and running");'); //check no bx services present
        assert.fileContent('README.md', 'maven');
        assert.noFileContent('README.md', 'gradle');
      });
    });

    describe(name + ': Generates a basic microservices project using two identical open api doc (no bluemix), gradle build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }, {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('gradle', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name);
      options.assertCompiles();

      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Congratulations, your application is up and running");'); //check no bx services present
        assert.fileContent('README.md', 'gradle');
        assert.noFileContent('README.md', 'maven');
      });
    });

    describe(name + ': Generates a basic microservices project using two identical open api doc (no bluemix), maven build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }, {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('maven', 'microservice', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name);
      options.assertCompiles();

      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Congratulations, your application is up and running");'); //check no bx services present
        assert.fileContent('README.md', 'maven');
        assert.noFileContent('README.md', 'gradle');
      });
    });

    describe(name + ': Generates a basic bff project using open api doc (no bluemix), gradle build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('gradle', 'bff', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name);
      options.assertCompiles();
    });

    describe(name + ': Generates a basic bff project using open api doc (no bluemix), maven build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('maven', 'bff', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name);
      options.assertCompiles();
    });

    describe(name + ': Generates a blank project using open api doc (no bluemix), gradle build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('gradle', 'blank', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name, true);
      options.assertCompiles();
    });

    describe(name + ': Generates a blank project using open api doc (no bluemix), maven build system', function () {
      var example = framework.test(frameworkType).getExampleOpenApi()
      var openApiServers = [
              {
                  "spec" : JSON.stringify(example.value)
              }
          ];
      var options = new Options('maven', 'blank', frameworkType, openApiServers);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, example.name, true);
      options.assertCompiles();
    });
  });
}
