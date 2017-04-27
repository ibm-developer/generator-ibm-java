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
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK = 'liberty';
const LIBERTY_CONFIG_FILE = 'src/main/liberty/config/server.xml';

var framework = require('../lib/test-framework');
var build = require('../lib/test-build');

var common = require('../lib/test-common');
var gradle = require('../lib/test-gradle');
var maven = require('../lib/test-maven');
var bluemix = require('../lib/test-bluemix.js');
var kube = require('../lib/test-kube.js');

function Options(createType, buildType, testBluemix, technologies) {
  this.options = {
    headless :  "true",
    debug : "true",
    buildType : buildType,
    createType : createType,
    promptType : 'prompt:liberty',
    technologies : technologies,
    appName : APPNAME,
    groupId : GROUPID,
    artifactId : ARTIFACTID,
    version : VERSION
  }
  this.assert = function() {
    common.assertCommonFiles();
    framework.test(FRAMEWORK).assertCommonFiles();
    framework.test(FRAMEWORK).assertBuildFiles(this.options.buildType);
    build.test(this.options.buildType).assertApplication(APPNAME, GROUPID, ARTIFACTID, VERSION);
    bluemix.test(testBluemix);
  }
  this.assertpicnmix = function() {
    this.assert();    //there are no additional files to check for
    kube.test(this.options.appName, false);
  }
  this.assertmsbuilder = function() {
    this.assert();    //there are no additional files to check for
    kube.test(this.options.appName, true);
  }
  this.before = function() {
    return helpers.run(path.join( __dirname, '../../generators/app'))
      .withOptions(this.options)
      .withPrompts({})
      .toPromise();
  }
  this.assertrest = function() {
    build.test(this.options.buildType).assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    build.test(this.options.buildType).assertDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    framework.test(FRAMEWORK).assertFeatures('jaxrs-2.0', 'jsonp-1.0');
    it('generates sample file LibertyRestEndpoint.java', function() {
      assert.file('src/main/java/application/rest/LibertyRestEndpoint.java');
    });
    it('generates sample file LibertyRestEndpoinTestIT.java', function() {
      assert.file('src/test/java/it/rest/LibertyRestEndpointTestIT.java');
    });
  }
}

var services = ['rest'];
var buildTypes = ['gradle', 'maven'];

execute('picnmix', 'picnmix', services);
execute('technologies/msbuilder', 'msbuilder', services);

function execute(createType, assertFunc, servicesToTest) {

  describe('java generator : technologies integration test', function () {

    for(var i = 0; i < servicesToTest.length; i++) {
      for(var j = 0; j < buildTypes.length; j++) {
        describe('Generates a ' + createType + ' project for ' + servicesToTest[i] + ' (' + buildTypes[j] + ', no bluemix)', function () {
          var options = new Options(createType, buildTypes[j], false, [servicesToTest[i]]);
          before(options.before.bind(options));
          options['assert' + assertFunc]();
          options['assert' + servicesToTest[i]]();
        });
      }
    }

  });
}
