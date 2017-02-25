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

function Options(buildType) {
  this.headless = "true";
  this.debug = "true";
  this.buildType = buildType;
  this.createType = 'microservice';
  this.version = VERSION;
  this.appName = APPNAME;
  this.groupId = GROUPID;
  this.assertCommonFiles = function() {
    //check common files are present for all configurations
    assert.file('src/main/java/application/api/v1/HealthEndpoint.java'); //application files
    assert.file('src/test/java/it/HealthEndpointTest.java');    //some tests
    assert.file('src/main/liberty/config/server.xml');    //liberty configuration
  }
}

describe('java generator : microservice integration test', function () {

  describe('Generates a basic microservices project (no bluemix)', function () {

    it('should create a basic microservice, gradle build system', function (done) {
      var options = new Options('gradle');
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
      .toPromise().then(function() {
        options.assertCommonFiles();
        assert.noFile('pom.xml');   //build file
        assert.file('build.gradle');
        assert.fileContent('build.gradle',"appName = '" + options.appName +"'");
        assert.fileContent('src/main/java/application/api/v1/Demo.java','ArrayList'); //check no bx services present
        done();
      }, function(err) {
        assert.fail(false, "Test failure ", err);
      });                        // Get a Promise back when the generator finishes
    });

    it('should create a basic microservice, maven build system', function (done) {
      var options = new Options('maven');
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
      .toPromise().then(function() {
        options.assertCommonFiles();
        assert.noFile('build.gradle');   //build file
        assert.file('pom.xml');
        assert.fileContent('pom.xml',"<app.name>" + options.appName + "</app.name>");
        assert.fileContent('src/main/java/application/api/v1/Demo.java','ArrayList'); //check no bx services present
        done();
      }, function(err) {
        assert.fail(false, "Test failure ", err);
      });                        // Get a Promise back when the generator finishes
    });

  });

  describe('Generates a basic microservices project (bluemix)', function () {

    it('no services', function (done) {
      var options = new Options('gradle');
      options.bluemix = '{"name" : "bxName"}';
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
      .toPromise().then(function() {
        options.assertCommonFiles();
        assert.noFile('pom.xml');   //build file
        assert.file('build.gradle');
        assert.fileContent('build.gradle',"appName = 'bxName'");
        assert.fileContent('src/main/webapp/WEB-INF/ibm-web-ext.xml','uri="/bxName"');
        assert.noFileContent('src/main/java/application/api/v1/Demo.java','ArrayList', 'Cloudant');
        assert.noFileContent('src/main/liberty/config/server.xml', 'cloudant');
        done();
      }, function(err) {
        assert.fail(false, "Test failure ", err);
      });                        // Get a Promise back when the generator finishes
    });

    it('with cloudant', function (done) {
      var options = new Options('maven');
      options.bluemix = '{"cloudant" : true, "name" : "bxName"}';
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
      .toPromise().then(function() {
        options.assertCommonFiles();
        assert.noFile('build.gradle');   //build file
        assert.file('pom.xml');
        assert.fileContent('pom.xml',"<app.name>bxName</app.name>");
        assert.fileContent('src/main/webapp/WEB-INF/ibm-web-ext.xml','uri="/bxName"');
        assert.noFileContent('src/main/java/application/api/v1/Demo.java','ArrayList'); //check no bx services present
        assert.fileContent('src/main/java/application/api/v1/Demo.java','Cloudant'); //check no bx services present
        assert.fileContent('src/main/liberty/config/server.xml', 'cloudant');
        done();
      }, function(err) {
        assert.fail(false, "Test failure ", err);
      });                        // Get a Promise back when the generator finishes
    });

  });
});
