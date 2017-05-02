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
const INDEX_HTML = 'src/main/webapp/index.html';

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
    it('generates an index.html', function() {
      assert.file(INDEX_HTML);
    });
    it('generates sample test files', function() {
      assert.file('src/test/java/it/EndpointTest.java');
      assert.file('src/test/java/it/TestApplication.java');
    });
  }
  this.assertpicnmix = function() {
    this.assert();    //there are no additional files to check for
    kube.test(this.options.appName, false);
  }
  this.assertmsbuilder = function() {
    this.assert();    //there are no additional files to check for
    kube.test(this.options.appName, true);
    it('adds MS Builder section to index.html', function() {
      assert.fileContent(INDEX_HTML, '<h2>Microservice Builder');
    });
    this.assertmicroprofiledep();
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
    it('generates an index.html file with a rest section', function() {
      assert.fileContent(INDEX_HTML, '<h2>REST</h2>');
    });
  }
  this.assertmicroprofile = function() {
    this.assertmicroprofiledep();
    it('generates an index.html file with a microprofile section', function() {
      assert.fileContent(INDEX_HTML, '<h2>MicroProfile</h2>');
    });
  }
  this.assertmicroprofiledep = function() {
    build.test(this.options.buildType).assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    build.test(this.options.buildType).assertDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    build.test(this.options.buildType).assertDependency('provided', 'javax.enterprise', 'cdi-api', '1.2');
    framework.test(FRAMEWORK).assertFeatures('microprofile-1.0');
  }
  this.assertpersistence = function() {
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.persistence', '1.0.10');
    build.test(this.options.buildType).assertDependency('provided', 'org.eclipse.persistence', 'javax.persistence', '2.1.0');
    framework.test(FRAMEWORK).assertFeatures('jpa-2.1');
    it('generates an index.html file with a persistence section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Persistence</h2>');
    });
  }
  this.assertwebsockets = function() {
    build.test(this.options.buildType).assertDependency('provided', 'javax.websocket', 'javax.websocket-api', '1.1');
    framework.test(FRAMEWORK).assertFeatures('websocket-1.1');
    it('generates an index.html file with a websockets section', function() {
      assert.fileContent(INDEX_HTML, '<h2>WebSockets</h2>');
    });
  }
}

var services = ['rest', 'microprofile', 'persistence', 'websockets'];
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

describe('java generator : technologies integration test', function () {

  for(var i = 0; i < buildTypes.length; i++) {
    describe('Generates a project for (no services or technologies)', function () {
      var options = new Options('picnmix', buildTypes[i], false, []);
      before(options.before.bind(options));
      options.assert();
    });
  }

});

for(var i = 0; i < 5; i++) {
  var totalServices = Math.floor(Math.random() * services.length);  //how many services to pick - min of 1 up to number of available services
  var svcsToPickFrom = Array.from(services);                        //copy of services to pick from
  var svcs = new Array();                                           //chosen services
  var description = new String();

  for(var j = 0; j < totalServices; ) {
    var index = Math.floor(Math.random() * services.length);
    var svc = svcsToPickFrom[index];
    if(svc) {
      svcs.push(services[index]);
      svcsToPickFrom[index] = undefined;
      description += svc + ' ';
      j++
    }
  }

  describe('java generator : ' + totalServices + ' random technologies integration test', function () {

    for(var k = 0; k < buildTypes.length; k++) {
      describe('Generates a project for [' + description.trim() + '] (' + buildTypes[k] + ', no bluemix)', function () {
        var options = new Options('picnmix', buildTypes[k], false, svcs);
        before(options.before.bind(options));
        options['assertpicnmix']();
        for(var l = 0; l < svcs.length; l++) {
          options['assert' + svcs[l]]();
        }
      });
    }

  });
}
