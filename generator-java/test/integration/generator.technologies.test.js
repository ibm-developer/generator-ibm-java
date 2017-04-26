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
var frameworkTest;

var common = require('../lib/test-common');
var gradle = require('../lib/test-gradle');
var maven = require('../lib/test-maven');
var bluemix = require('../lib/test-bluemix.js');

function Options(buildType, technologies) {
  this.options = {
    headless :  "true",
    debug : "true",
    buildType : buildType,
    createType : 'picnmix',
    technologies : technologies,
    version : VERSION,
    appName : APPNAME,
    groupId : GROUPID,
    artifactId : ARTIFACTID
  }
  this.assert = function() {
    common.assertCommonFiles();
    framework.test(FRAMEWORK).assertCommonFiles();
  }
  this.before = function() {
    return helpers.run(path.join( __dirname, '../../generators/app'))
      .withOptions(this.options)
      .withPrompts({})
      .toPromise();
  }
}

describe('java generator : technologies integration test', function () {

  describe('Generates a basic technologies project (gradle, no bluemix)', function () {

    var options = new Options('gradle', ["rest"]);

    before(options.before.bind(options));

    options.assert();
    gradle.assertApplication(APPNAME, GROUPID, ARTIFACTID, VERSION);
    gradle.assertGradleDependency('providedCompile', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    gradle.assertGradleDependency('providedCompile', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    gradle.assertGradleDependency('providedCompile', 'javax.json', 'javax.json-api', '1.0');
    gradle.assertGradleDependency('providedCompile', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    framework.test(FRAMEWORK).assertGradleFiles();
    bluemix.test(false);
  });

  describe('Generates a basic technologies project (maven, no bluemix)', function () {

    var options = new Options('maven', ["rest"]);

    before(options.before.bind(options));

    options.assert();
    maven.assertApplication(APPNAME, GROUPID, ARTIFACTID, VERSION);
    maven.assertMavenDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    maven.assertMavenDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.10');
    maven.assertMavenDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    maven.assertMavenDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.10');
    framework.test(FRAMEWORK).assertMavenFiles();
    bluemix.test(false);
  });

});
