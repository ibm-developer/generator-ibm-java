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
const command = tests.test('command');
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
  this.assert = function() {
    common.assertFiles('.', true, 'README.md', 'Dockerfile');
    tests.test(buildType).assertApplication(APPNAME, GROUPID, ARTIFACTID, VERSION);
    bluemix.test(testBluemix);
    this.assertTech.assert(APPNAME, springSelected);
  }
  this.assertCompiles = function() {
    command.run(tests.test(buildType).getCompileCommand());
  }
  this.assertpicnmix = function() {
    this.assert(this.options.appName, false);    //there are no additional files to check for
    kube.test(this.options.appName, false);
  }
  this.assertmsbuilder = function() {
    this.assert(this.options.appName, false);    //there are no additional files to check for
    kube.test(this.options.appName, true);
  }
  this.before = function() {
    return helpers.run(path.join( __dirname, '../../generators/app'))
      .withOptions(this.options)
      .withPrompts({})
      .toPromise();
  }
  this.assertrest = function() {
    this.assertTech.assertrest(this.options.buildType);
  }
  this.assertmicroprofile = function() {
    this.assertTech.assertmicroprofile(this.options.buildType);
  }
  this.assertpersistence = function() {
    this.assertTech.assertpersistence(this.options.buildType);
  }
  this.assertwebsockets = function() {
    this.assertTech.assertwebsockets(this.options.buildType);
  }
  this.assertservlet = function() {
    this.assertTech.assertservlet(this.options.buildType);
  }
  this.assertwatsonsdk = function() {
    this.assertTech.assertwatsonsdk(this.options.buildType);
  }
  this.assertswagger = function() {
    this.assertTech.assertswagger(this.options.buildType);
  }
  this.assertspringboot_web = function() {
    this.assertTech.assertspringboot_web(this.options.buildType);
  }
  this.assertspringboot_webonly = function() {
    this.assertTech.assertspringboot_webonly(this.options.buildType);
  }
  this.asserthealthdeps = function() {
    this.assertTech.asserthealthdeps(this.options.buildType);
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
