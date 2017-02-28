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
 * Tests the basic generator
 */
'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var config = require('../../generators/lib/config');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';

function Options() {
  this.debug = "true";
  this.version = VERSION;
  this.groupId = GROUPID;
  this.assertCommonFiles = function() {
    //check common files are present for all configurations
    assert.noFile('src/main/java/application/api/v1/HealthEndpoint.java'); //application files
    assert.noFile('src/test/java/it/HealthEndpointTest.java');    //some tests
    assert.file('src/main/liberty/config/server.xml');    //liberty configuration
    assert.noFile('src/main/webapp/WEB-INF/ibm-web-ext.xml');
    //Docker files
    assert.file('Dockerfile');
    assert.file('Dockerfile-tools');
    assert.noFile('Dockerfile-run');//deprecated name
    // Bluemix files
    assert.file('manifest.yml');
    assert.file('.bluemix/deploy.json');
    assert.file('.bluemix/pipeline.yml');
    assert.file('.bluemix/toolchain.yml');
  }
}

beforeEach(function() {
  //make sure we start with a valid config object
  config.reset();
});

describe('java generator : basic integration test', function () {

  describe('Generates a basic project (no bluemix)', function () {

    it('should create a basic project, gradle build system', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({ buildType : 'gradle', createType: 'basic', services: ['none'], appName: APPNAME})
      .toPromise().then(function() {
        options.assertCommonFiles();
        assert.noFile('pom.xml');   //build file
        assert.file('build.gradle');
        assert.fileContent('build.gradle',"appName = '" + APPNAME +"'");
        assert.fileContent('cli-config.yml','image-name-run : "testapp"');  //make sure lowercase app name
        // Bluemix files
        assert.noFileContent('manifest.yml', 'cloudant');
        assert.noFileContent('.bluemix/pipeline.yml', 'cloudant');
        done();
      }, function(err) {
        assert.fail(false, "Test failure ", err);
      });                        // Get a Promise back when the generator finishes
    });

    it('should create a basic project, maven build system', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({buildType : 'maven', createType: 'basic', appName: APPNAME })
      .toPromise().then(function() {
        options.assertCommonFiles();
        assert.noFile('build.gradle');   //build file
        assert.file('pom.xml');
        assert.fileContent('pom.xml',"<app.name>" + APPNAME + "</app.name>");
        assert.fileContent('cli-config.yml','image-name-run : "testapp"');  //make sure lowercase app name
        // Bluemix files
        assert.noFileContent('manifest.yml', 'cloudant');
        assert.noFileContent('.bluemix/pipeline.yml', 'cloudant');
        done();
      }, function(err) {
        assert.fail(false, "Test failure ", err);
      });                        // Get a Promise back when the generator finishes
    });

  });

  describe('Generates a basic project (bluemix)', function () {

    it('with cloudant', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({buildType : 'maven', createType: 'basic', services : ['cloudant'], appName : 'bxName' })
      .toPromise().then(function() {
        options.assertCommonFiles();
        assert.noFile('build.gradle');   //build file
        assert.file('pom.xml');
        assert.fileContent('pom.xml',"<app.name>bxName</app.name>");
        assert.fileContent('src/main/liberty/config/server.xml', 'cloudant');
        assert.fileContent('cli-config.yml','image-name-run : "bxname"');  //make sure lowercase app name
        // Bluemix files
        assert.fileContent('manifest.yml', 'cloudant');
        assert.fileContent('.bluemix/pipeline.yml', 'cloudant');
        done();
      }, function(err) {
        assert.fail(false, "Test failure ", err);
      });                        // Get a Promise back when the generator finishes
    });

  });

});
