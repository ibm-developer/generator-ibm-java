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
var common = require('../lib/commontest');
var framework = require('../lib/test-framework');
var frameworkTest;

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK = 'liberty';
const LIBERTY_CONFIG_FILE = 'src/main/liberty/config/server.xml';

function Options(buildType, technologies) {
  this.headless = "true";
  this.debug = "true";
  this.buildType = buildType;
  this.createType = 'technologies';
  this.technologies = technologies;
  this.version = VERSION;
  this.appName = APPNAME;
  this.groupId = GROUPID;
  this.assert = function() {
    common.assertCommonFiles();
    frameworkTest = framework.test(FRAMEWORK);
  }
}

describe('java generator : technologies integration test', function () {

  describe('Generates a basic technologies project (no bluemix)', function () {

    it('should create a rest project, gradle build system', function (done) {
      var options = new Options('gradle', [{"name" : "rest"}]);
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert()
          common.assertGradleFiles(APPNAME);
          frameworkTest.assertGradleFiles();

          assert.fileContent('build.gradle', "providedCompile 'javax.ws.rs:javax.ws.rs-api:2.0.1'");
          assert.fileContent('build.gradle', "providedCompile 'com.ibm.websphere.appserver.api:com.ibm.websphere.appserver.api.jaxrs20:1.0.10'");
          assert.fileContent('build.gradle', "providedCompile 'javax.json:javax.json-api:1.0'");
          assert.fileContent('build.gradle', "providedCompile 'com.ibm.websphere.appserver.api:com.ibm.websphere.appserver.api.json:1.0.10'");
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('should create a rest project, maven build system', function (done) {
      var options = new Options('maven', [{"name" : "rest"}]);
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert()
          common.assertMavenFiles(APPNAME);
          frameworkTest.assertMavenFiles();

          assert.fileContent('pom.xml', /<groupId>javax\.ws\.rs<\/groupId>\s*<artifactId>javax\.ws\.rs-api<\/artifactId>\s*<version>2\.0\.1<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>com\.ibm\.websphere\.appserver\.api<\/groupId>\s*<artifactId>com\.ibm\.websphere\.appserver\.api\.jaxrs20<\/artifactId>\s*<version>1\.0\.10<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>javax\.json<\/groupId>\s*<artifactId>javax\.json-api<\/artifactId>\s*<version>1\.0<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>com\.ibm\.websphere\.appserver\.api<\/groupId>\s*<artifactId>com\.ibm\.websphere\.appserver\.api\.json<\/artifactId>\s*<version>1\.0\.10<\/version>\s*<scope>provided<\/scope>/);
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

  });

});
