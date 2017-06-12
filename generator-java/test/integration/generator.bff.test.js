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
var common = require('../lib/commontest');
var framework = require('../lib/test-framework');
var frameworkTest;

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK = 'liberty';
const LIBERTY_CONFIG_FILE = 'src/main/liberty/config/server.xml';

function Options() {
  this.debug = "true";
  this.version = VERSION;
  this.groupId = GROUPID;
  this.assert = function(appName, ymlName, cloudant, objectStorage) {
    common.assertCommonFiles();
    common.assertCLI(appName);
    common.assertBluemixSrc(cloudant || objectStorage);
    common.assertManifestYml(ymlName, cloudant || objectStorage);
    common.assertCloudant(cloudant);
    common.assertObjectStorage(objectStorage);
    common.assertK8s(appName);
    common.assertFiles('', true, 'README.md');
    common.assertFiles('src', true, 'main/java/application/rest/SwaggerEndpoint.java',
                                    'main/java/application/model/Product.java',
                                    'main/java/application/openapi/ProductsApi.java',
                                    'main/java/application/openapi/ProductApi.java',
                                    'test/java/it/ProductsEndpointTest.java',
                                    'test/java/it/SwaggerEndpointTest.java')
    frameworkTest = framework.test(FRAMEWORK);
    frameworkTest.assertCloudant(cloudant);
    frameworkTest.assertObjectStorage(objectStorage);
    assert.fileContent(LIBERTY_CONFIG_FILE, '<feature>apiDiscovery-1.0</feature>');
  }
}

describe('java generator : bff integration test', function () {

  describe('Generates a basic bff project (no bluemix)', function () {

    it('with gradle build system', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({extName : 'prompt:patterns', buildType : 'gradle', createType: 'bff', services: ['none'], appName: APPNAME})
      .toPromise().then(function() {
        try {
          options.assert(APPNAME, APPNAME, false, false);
          common.assertGradleFiles(APPNAME);
          frameworkTest.assertBuildFiles('gradle');
          assert.fileContent('build.gradle', "providedCompile ('io.swagger:swagger-annotations:1.5.3')");
          assert.fileContent('build.gradle', "name = ['apiDiscovery-1.0']");
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('with maven build system', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', appName: APPNAME })
      .toPromise().then(function() {
        try {
          options.assert(APPNAME, APPNAME, false, false);
          common.assertMavenFiles(APPNAME);
          frameworkTest.assertBuildFiles('maven');
          assert.fileContent('pom.xml', /<groupId>io\.swagger<\/groupId>\s*<artifactId>swagger-annotations<\/artifactId>\s*<version>1\.5\.3<\/version>/);
          assert.fileContent('pom.xml', /<feature>apiDiscovery-1\.0<\/feature>/);
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

  });

  describe('Generates a basic bff project (bluemix)', function () {

    it('with cloudant', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', services : ['cloudant'], appName : 'bxName' })
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'testBxName', true, false);
          common.assertMavenFiles('bxName');
          frameworkTest.assertBuildFiles('maven');
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });
    it('with objectStorage', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', services : ['objectStorage'], appName : 'bxName' })
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'testBxName', false, true);
          common.assertMavenFiles('bxName');
          frameworkTest.assertBuildFiles('maven');
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('with cloudant and objectStorage', function (done) {
      var options = new Options();
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({extName : 'prompt:patterns', buildType : 'maven', createType: 'bff', services : ['objectStorage', 'cloudant'], appName : 'bxName' })
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'testBxName', true, true);
          common.assertMavenFiles('bxName');
          frameworkTest.assertBuildFiles('maven');
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
