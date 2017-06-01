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
var command = require('../lib/test-command');
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
  this.assertservlet = function() {
    build.test(this.options.buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    framework.test(FRAMEWORK).assertFeatures('servlet-3.1');
    it('generates an index.html file with a servlet section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Servlet</h2>');
    });
  }
  this.assertwatsonsdk = function() {
    build.test(this.options.buildType).assertDependency('compile', 'com.ibm.watson.developer_cloud', 'java-sdk', '3.5.1');
    it('generates an index.html file with a Watson SDK section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Watson SDK</h2>');
    });
  }
  this.assertswagger = function() {
    build.test(this.options.buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    build.test(this.options.buildType).assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
    it('generates an index.html file with a Swagger section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Swagger</h2>');
    });
  }
  this.assertspringboot_web = function() {
    build.test(this.options.buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    build.test(this.options.buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.0.10');
    var exclusions = [{"groupId" : "org.springframework.boot", "artifactId" : "spring-boot-starter-tomcat"}];
    build.test(this.options.buildType).assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web', '1.3.0.RELEASE', exclusions);
    it('generates an index.html file with a Spring Boot section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Spring Boot with Spring MVC</h2>');
    });
  }
}

var technologies = ['rest', 'microprofile', 'persistence', 'websockets', 'servlet', 'watsonsdk', 'swagger', 'springboot_web'];
var buildTypes = ['gradle', 'maven'];

execute('picnmix', 'picnmix', technologies);
execute('technologies/msbuilder', 'msbuilder', technologies);

function execute(createType, assertFunc, technologiesToTest) {

  describe('java generator : technologies integration test', function () {

    for(var i = 0; i < technologiesToTest.length; i++) {
      for(var j = 0; j < buildTypes.length; j++) {
        describe('Generates a ' + createType + ' project for ' + technologiesToTest[i] + ' (' + buildTypes[j] + ', no bluemix)', function () {
          var options = new Options(createType, buildTypes[j], false, [technologiesToTest[i]]);
          before(options.before.bind(options));
          options['assert' + assertFunc]();
          options['assert' + technologiesToTest[i]]();
          options.assertCompiles();
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
  var totalTechnologies = Math.floor(Math.random() * technologies.length) + 1;  //how many technologies to pick - min of 1 up to number of available technologies
  var techsToPickFrom = Array.from(technologies);                        //copy of technologies to pick from
  var techs = new Array();                                           //chosen technologies
  var description = new String();

  for(var j = 0; j < totalTechnologies; ) {
    var index = Math.floor(Math.random() * technologies.length);
    var tech = techsToPickFrom[index];
    if(tech) {
      techs.push(technologies[index]);
      techsToPickFrom[index] = undefined;
      description += tech + ' ';
      j++;
    }
  }

  describe('java generator : ' + totalTechnologies + ' random technologies integration test', function () {

    for(var k = 0; k < buildTypes.length; k++) {
      describe('Generates a project for [' + description.trim() + '] (' + buildTypes[k] + ', no bluemix)', function () {
        var options = new Options('picnmix', buildTypes[k], false, techs);
        before(options.before.bind(options));
        options.assertpicnmix();
        for(var l = 0; l < techs.length; l++) {
          options['assert' + techs[l]]();
        }
      });
    }

  });
}
