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

//external modules
const liberty = require('@arf/generator-liberty');
const tests = require('@arf/java-common');

//internal libraries
var framework = require('../lib/test-framework');
var common = require('../lib/test-common');
var command = require('../lib/test-command');
var bluemix = require('../lib/test-bluemix.js');
var kube = require('../lib/test-kube.js');

function Options(createType, buildType, testBluemix, technologies, springSelected) {
  this.assertTech = new liberty.integrationAsserts.technologies();
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
  this.getCompileCommand = function() {
    if(this.options.buildType === 'maven') {
      return 'mvn test-compile'; //compiles the main and test classes
    }
    if(this.options.buildType === 'gradle') {
      return 'gradle compileTestJava'; //compiles the main and test classes
    }
    throw "getCompileCommand : expected buildType to be one of maven or gradle";
  }
  this.assert = function() {
    common.assertFiles('.', true, 'README.md', 'Dockerfile');
    framework.test(FRAMEWORK).assertFiles(APPNAME);
    framework.test(FRAMEWORK).assertSourceFiles(springSelected);
    framework.test(FRAMEWORK).assertBuildFiles(this.options.buildType);
    tests.test(this.options.buildType).assertApplication(APPNAME, GROUPID, ARTIFACTID, VERSION);
    bluemix.test(testBluemix);
    this.assertTech.assert();
  }
  this.assertCompiles = function() {
    command.run(this.getCompileCommand());
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
    tests.test(this.options.buildType).assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    tests.test(this.options.buildType).assertDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    framework.test(FRAMEWORK).assertFeatures('jaxrs-2.0', 'jsonp-1.0');
    this.assertTech.assertrest();
  }
  this.assertmicroprofile = function() {
    this.assertmicroprofiledep();
    this.assertTech.assertmicroprofile();
  }
  this.assertmicroprofiledep = function() {
    tests.test(this.options.buildType).assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    tests.test(this.options.buildType).assertDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    tests.test(this.options.buildType).assertDependency('provided', 'javax.enterprise', 'cdi-api', '1.2');
    framework.test(FRAMEWORK).assertFeatures('microprofile-1.0');
  }
  this.assertpersistence = function() {
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.persistence', '1.0.10');
    tests.test(this.options.buildType).assertDependency('provided', 'org.eclipse.persistence', 'javax.persistence', '2.1.0');
    framework.test(FRAMEWORK).assertFeatures('jpa-2.1');
    this.assertTech.assertpersistence();
  }
  this.assertwebsockets = function() {
    tests.test(this.options.buildType).assertDependency('provided', 'javax.websocket', 'javax.websocket-api', '1.1');
    framework.test(FRAMEWORK).assertFeatures('websocket-1.1');
    this.assertTech.assertwebsockets();
  }
  this.assertservlet = function() {
    tests.test(this.options.buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    framework.test(FRAMEWORK).assertFeatures('servlet-3.1');
    this.assertTech.assertservlet();
  }
  this.assertwatsonsdk = function() {
    tests.test(this.options.buildType).assertDependency('compile', 'com.ibm.watson.developer_cloud', 'java-sdk', '3.5.1');
    this.assertTech.assertwatsonsdk();
  }
  this.assertswagger = function() {
    tests.test(this.options.buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    tests.test(this.options.buildType).assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
    framework.test(FRAMEWORK).assertFeatures('apiDiscovery-1.0');
    this.assertTech.assertswagger();
  }
  this.assertspringboot_web = function() {
    tests.test(this.options.buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    var exclusions = [{"groupId" : "org.springframework.boot", "artifactId" : "spring-boot-starter-tomcat"}];
    tests.test(this.options.buildType).assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web', '1.3.0.RELEASE', exclusions);
    this.assertTech.assertspringboot_web();
  }
  this.assertspringboot_webonly = function() {
    tests.test(this.options.buildType).assertNoDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    tests.test(this.options.buildType).assertNoDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    framework.test(FRAMEWORK).assertFeatures(false, 'jaxrs-2.0');
  }
  this.asserthealthdeps = function() {
    tests.test(this.options.buildType).assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    tests.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    framework.test(FRAMEWORK).assertFeatures('jaxrs-2.0');
  }
}

var technologies = ['rest', 'microprofile', 'persistence', 'websockets', 'servlet', 'watsonsdk', 'swagger', 'springboot_web'];
var buildTypes = ['gradle', 'maven'];

execute('picnmix', 'picnmix', technologies);
//execute('technologies/msbuilder', 'msbuilder', technologies);

function execute(createType, assertFunc, technologiesToTest) {

  describe('java generator : technologies integration test', function () {

    for(var i = 0; i < technologiesToTest.length; i++) {
      for(var j = 0; j < buildTypes.length; j++) {
        describe('Generates a ' + createType + ' project for ' + technologiesToTest[i] + ' (' + buildTypes[j] + ', no bluemix)', function () {
          var options = new Options(createType, buildTypes[j], false, [technologiesToTest[i]], technologiesToTest[i] === 'springboot_web');
          before(options.before.bind(options));
          options['assert' + assertFunc]();
          options['assert' + technologiesToTest[i]]();
          if(technologiesToTest[i] === 'springboot_web' && createType === 'picnmix') {
            options.assertspringboot_webonly();
          }
          options.assertCompiles();
        });
      }
    }

  });
}

describe('java generator : technologies integration test', function () {

  for(var i = 0; i < buildTypes.length; i++) {
    describe('Generates a project for (no services or technologies)', function () {
      var options = new Options('picnmix', buildTypes[i], false, [], false);
      before(options.before.bind(options));
      options.assert();
      options.asserthealthdeps();
    });
  }

});
