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
const core = require('../lib/core');
const extend = require('extend');
const common = require('../lib/test-common');

class Options extends core.BxOptions {
  constructor(buildType, frameworkType) {
    super(frameworkType === 'spring' ? 'SPRING' : 'JAVA');
    extend(this.values, {
      headless :  "true",
      buildType : buildType,
      frameworkType : frameworkType || FRAMEWORK_LIBERTY,
      createType : 'microservice/' + (frameworkType || FRAMEWORK_LIBERTY),
      appName : core.APPNAME
    });
  }

  assert(appName, ymlName, cloudant, objectStorage) {
    super.assert(appName, ymlName, cloudant, objectStorage);
    this.assertCloudant(cloudant);
    this.assertObjectStorage(objectStorage);
    this.values.frameworkType === FRAMEWORK_LIBERTY ? this.assertliberty() : this.assertspring();
    this.assertBuild(appName);
    common.assertToolchainBxCreate();
  }

  assertBuild(appName) {
    super.assertBuild(appName);
  }

  //Liberty specific things to test for
  assertliberty() {
    super.assertliberty();
    var test = tests.test(this.values.buildType);
    test.assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    test.assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    test.assertDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    test.assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    test.assertDependency('provided', 'javax.enterprise', 'cdi-api', '1.2');
    framework.test(FRAMEWORK_LIBERTY).assertSourceFiles(false);
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('jaxrs-2.0');
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('jsonp-1.0');
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('jndi-1.0');
    framework.test(FRAMEWORK_LIBERTY).assertFeatures('cdi-1.2');
  }

  assertspring() {
    super.assertspring();
  }

  assertCloudant(exists) {
    var check = this.getCheck(exists);
    var invcheck = this.getCheck(exists^exists);
    it(check.desc + 'common cloudant source files', function () {
      check.content('src/main/java/application/rest/v1/Example.java','Cloudant'); //check Cloudant service present
      check.content('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-cloudantNoSQLDB-000")');
      check.content('README.md', 'cloudant');
    });
    if(this.values.frameworkType === FRAMEWORK_LIBERTY) {
      it(check.desc + 'Liberty cloudant source files', function () {
        check.file('src/main/java/application/cloudant/Cloudant.java')
      });
      it(invcheck.desc + 'Spring cloudant source files', function () {
        invcheck.file('src/main/java/application/cloudant/CloudantClientConfig.java')
      });
    }
    if(this.values.frameworkType === FRAMEWORK_SPRING) {
      it(invcheck.desc + 'Liberty cloudant source files', function () {
        invcheck.file('src/main/java/application/cloudant/Cloudant.java')
      });
      it(check.desc + 'Spring cloudant source files', function () {
        check.file('src/main/java/application/cloudant/CloudantClientConfig.java')
      });
    }
  }

  assertObjectStorage(exists) {
    var check = this.getCheck(exists);
    var invcheck = this.getCheck(exists^exists);
    it(check.desc + 'Object Storage source files', function () {
      check.content('src/main/java/application/rest/v1/Example.java','OSClient'); //check object Storage service present
      check.content('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-Object-Storage-000")');
      check.content('README.md', 'Object Storage service');
    });
    if(this.values.frameworkType === FRAMEWORK_LIBERTY) {
      it(check.desc + 'Liberty objectStorage source files', function () {
        check.file('src/main/java/application/objectstorage/ObjectStorage.java')
      });
      it(invcheck.desc + 'Spring objectStorage source files', function () {
        invcheck.file('src/main/java/application/objectstorage/ObjectStorageConfig.java')
      });
    }
    if(this.values.frameworkType === FRAMEWORK_SPRING) {
      it(invcheck.desc + 'Liberty objectStorage source files', function () {
        invcheck.file('src/main/java/application/objectstorage/ObjectStorage.java')
      });
      it(check.desc + 'Spring objectStorage source files', function () {
        check.file('src/main/java/application/objectstorage/ObjectStorageConfig.java')
      });
    }
  }
}


execute(FRAMEWORK_LIBERTY);
//execute(FRAMEWORK_SPRING);

function execute(framework) {
  const name = framework.toUpperCase();
  const backendPlatform = framework === 'liberty' ? 'JAVA' : 'SPRING';

  describe('java generator : microservice integration test', function () {
    this.timeout(7000);

    //execute each of these tests for both Liberty and Spring frameworks
    describe(name + ': Generates a basic microservices project (no bluemix), gradle build system', function () {
      var options = new Options('gradle', framework);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, false, false);

      it('should create a basic microservice, gradle build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Some data");'); //check no bx services present
        assert.fileContent('README.md', 'gradle');
        assert.noFileContent('README.md', 'maven');
      });
    });

    describe(name + ': Generates a basic microservices project (no bluemix), maven build system', function () {
      var options = new Options('maven', framework);
      before(options.before.bind(options));
      options.assert(core.APPNAME, core.APPNAME, false, false);

      it('should create a basic microservice, maven build system', function () {
        assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Some data");'); //check no bx services present
        assert.fileContent('README.md', 'maven');
        assert.noFileContent('README.md', 'gradle');
      });
    });

    describe(name + ': Generates a basic microservices project (gradle, bluemix, no services)', function () {

      var options = new Options('gradle', framework);
      options.values.bluemix.name = 'bxName';
      before(options.before.bind(options));
      options.assert('bxName', 'bxName', false, false);

      it('with no services', function () {
        assert.noFileContent('src/main/java/application/rest/v1/Example.java', 'Cloudant');

        assert.fileContent('manifest.yml', 'name: bxName') //Not using prompt so we get app name and random route
        assert.fileContent('manifest.yml', 'random-route: true') //Not using prompt so we get app name and random route
        assert.noFileContent('README.md', 'cloudant');
      });
    });

    describe(name + ': Generates a basic microservices project (maven, bluemix, cloudant)', function () {

      var options = new Options('maven', framework);
      options.values.bluemix = '{"name" : "bxName", "backendPlatform" : "' + backendPlatform + '", "server" : {"host": "host", "domain": "mybluemix.net", "services" : ["cloudant"]}, "cloudant" : [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},"password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}]}';
      before(options.before.bind(options));

      options.assert('bxName', 'bxName', true, false);
    });

    describe(name + ': Generates a basic microservices project (gradle, bluemix, cloudant)', function () {

      var options = new Options('gradle', framework);
      options.values.bluemix = '{"name" : "bxName", "backendPlatform" : "' + backendPlatform + '", "server" : {"host": "host", "domain": "mybluemix.net", "services" : ["cloudant"]}, "cloudant" : [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},"password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}]}';
      before(options.before.bind(options));

      options.assert('bxName', 'bxName', true, false);
    });

    describe(name + ': Generates a basic microservices project (maven, bluemix, objectStorage)', function () {

      var options = new Options('maven', framework);
      options.values.bluemix = '{"name" : "bxName", "backendPlatform" : "' + backendPlatform + '", "server" : {"host": "host", "domain": "mybluemix.net", "services" : ["objectStorage"]}, "objectStorage" : [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},"project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password","auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}]}';
      before(options.before.bind(options));

      options.assert('bxName', 'bxName', false, true);
    });

    describe(name + ': Generates a basic microservices project (gradle, bluemix, objectStorage)', function () {

      var options = new Options('gradle', framework);
      options.values.bluemix = '{"name" : "bxName", "backendPlatform" : "' + backendPlatform + '", "server" : {"host": "host", "domain": "mybluemix.net", "services" : ["objectStorage"]}, "objectStorage" : [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},"project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password","auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}]}';
      before(options.before.bind(options));

      options.assert('bxName', 'bxName', false, true);
    });

  });
}
