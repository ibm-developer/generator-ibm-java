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

/* Test to see if when you choose every technology type it builds */

'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';

var command = require('../lib/test-command');

function Options(buildType) {
  this.options = {
    headless :  "true",
    debug : "true",
    buildType : buildType,
    createType : 'microservice',
    appName : APPNAME,
    groupId : GROUPID,
    artifactId : ARTIFACTID,
    version : VERSION
  }
  this.getBuildCommand = function() {
    if(this.options.buildType === 'maven') {
      return 'mvn install'; //compiles the main and test classes
    }
    if(this.options.buildType === 'gradle') {
      return 'gradle build'; //compiles the main and test classes
    }
    throw "getBuildCommand : expected buildType to be one of maven or gradle";
  }
  this.assertBuilds = function() {
    command.run(this.getBuildCommand());
  }
  this.before = function() {
    return helpers.run(path.join( __dirname, '../../generators/app'))
      .withOptions(this.options)
      .withPrompts({})
      .toPromise();
  }
}

describe('java generator : microservice end to end test', function() {
  var buildTypes = ['gradle', 'maven'];
  for(var i=0; i < buildTypes.length; i++) {
    describe('Generates a microservice project build type ' + buildTypes[i], function () {
      var options = new Options(buildTypes[i]);
      before(options.before.bind(options));
      options.assertBuilds();
    });
  }
});
