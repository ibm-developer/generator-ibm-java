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

function Options(buildType) {
  this.headless = "true";
  this.debug = "true";
  this.buildType = buildType;
  this.createType = 'microservice';
  this.version = VERSION;
  this.appName = APPNAME;
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
    common.assertFiles('src', true, 'main/java/application/rest/HealthEndpoint.java',
                                    'test/java/it/HealthEndpointTest.java')
    frameworkTest = framework.test(FRAMEWORK);
    frameworkTest.assertCloudant(cloudant);
    frameworkTest.assertObjectStorage(objectStorage);
    assert.fileContent(LIBERTY_CONFIG_FILE, '<feature>jaxrs-2.0</feature>');
    assert.fileContent(LIBERTY_CONFIG_FILE, '<feature>jsonp-1.0</feature>');
    assert.fileContent(LIBERTY_CONFIG_FILE, '<feature>jndi-1.0</feature>');
    assert.fileContent(LIBERTY_CONFIG_FILE, '<feature>cdi-1.2</feature>');
  }
}

describe('java generator : microservice integration test', function () {

  describe('Generates a basic microservices project (no bluemix)', function () {

    it('should create a basic microservice, gradle build system', function (done) {
      var options = new Options('gradle');
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert(APPNAME, APPNAME, false, false)
          common.assertGradleFiles(APPNAME);
          frameworkTest.assertGradleFiles();

          assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Some data");'); //check no bx services present
          assert.fileContent('README.md', 'gradle');
          assert.noFileContent('README.md', 'maven');
          assert.fileContent('build.gradle', "providedCompile 'javax.servlet:javax.servlet-api:3.1.0'");
          assert.fileContent('build.gradle', "providedCompile 'com.ibm.websphere.appserver.api:com.ibm.websphere.appserver.api.servlet:1.0.10'");
          assert.fileContent('build.gradle', "providedCompile 'javax.ws.rs:javax.ws.rs-api:2.0.1'");
          assert.fileContent('build.gradle', "providedCompile 'com.ibm.websphere.appserver.api:com.ibm.websphere.appserver.api.jaxrs20:1.0.10'");
          assert.fileContent('build.gradle', "providedCompile 'javax.json:javax.json-api:1.0'");
          assert.fileContent('build.gradle', "providedCompile 'com.ibm.websphere.appserver.api:com.ibm.websphere.appserver.api.json:1.0.10'");
          assert.fileContent('build.gradle', "providedCompile 'javax.enterprise:cdi-api:1.2'");
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('should create a basic microservice, maven build system', function (done) {
      var options = new Options('maven');
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert(APPNAME, APPNAME, false, false)
          common.assertMavenFiles(APPNAME);
          frameworkTest.assertMavenFiles();

          assert.fileContent('src/main/java/application/rest/v1/Example.java','list.add("Some data");'); //check no bx services present
          assert.fileContent('README.md', 'maven');
          assert.noFileContent('README.md', 'gradle');
          assert.fileContent('pom.xml', /<groupId>javax\.servlet<\/groupId>\s*<artifactId>javax\.servlet-api<\/artifactId>\s*<version>3\.1\.0<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>com\.ibm\.websphere\.appserver\.api<\/groupId>\s*<artifactId>com\.ibm\.websphere\.appserver\.api\.servlet<\/artifactId>\s*<version>1\.0\.10<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>javax\.ws\.rs<\/groupId>\s*<artifactId>javax\.ws\.rs-api<\/artifactId>\s*<version>2\.0\.1<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>com\.ibm\.websphere\.appserver\.api<\/groupId>\s*<artifactId>com\.ibm\.websphere\.appserver\.api\.jaxrs20<\/artifactId>\s*<version>1\.0\.10<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>javax\.json<\/groupId>\s*<artifactId>javax\.json-api<\/artifactId>\s*<version>1\.0<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>com\.ibm\.websphere\.appserver\.api<\/groupId>\s*<artifactId>com\.ibm\.websphere\.appserver\.api\.json<\/artifactId>\s*<version>1\.0\.10<\/version>\s*<scope>provided<\/scope>/);
          assert.fileContent('pom.xml', /<groupId>javax\.enterprise<\/groupId>\s*<artifactId>cdi-api<\/artifactId>\s*<version>1\.2<\/version>\s*<scope>provided<\/scope>/);
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

  });

  describe('Generates a basic microservices project (bluemix)', function () {

    it('no services', function (done) {
      var options = new Options('gradle');
      options.bluemix = '{"name" : "bxName"}';
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'bxName', false, false)
          common.assertGradleFiles('bxName');
          frameworkTest.assertGradleFiles();

          assert.fileContent('src/main/webapp/WEB-INF/ibm-web-ext.xml','uri="/bxName"');
          assert.noFileContent('src/main/java/application/rest/v1/Example.java', 'Cloudant');

          assert.fileContent('manifest.yml', 'name: bxName') //Not using prompt so we get app name and random route
          assert.fileContent('manifest.yml', 'random-route: true') //Not using prompt so we get app name and random route
          assert.noFileContent('README.md', 'cloudant');
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('with cloudant and maven', function (done) {
      var options = new Options('maven');
      options.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["cloudant"]}, "cloudant" : [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},"password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}]}';
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'bxName', true, false)
          common.assertMavenFiles('bxName');
          frameworkTest.assertMavenFiles();

          assert.fileContent('src/main/webapp/WEB-INF/ibm-web-ext.xml','uri="/bxName"');
          assert.fileContent('src/main/java/application/rest/v1/Example.java','Cloudant'); //check Cloudant service present
          assert.fileContent('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-cloudantNoSQLDB-000")');

          assert.fileContent('README.md', 'cloudant');
          assert.fileContent('pom.xml', /<groupId>com\.cloudant<\/groupId>\s*<artifactId>cloudant-client<\/artifactId>\s*<version>2\.7\.0<\/version>/);
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('with cloudant and maven', function (done) {
      var options = new Options('gradle');
      options.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["cloudant"]}, "cloudant" : [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},"password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}]}';
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'bxName', true, false)
          common.assertGradleFiles('bxName');
          frameworkTest.assertGradleFiles();

          assert.fileContent('src/main/webapp/WEB-INF/ibm-web-ext.xml','uri="/bxName"');
          assert.fileContent('src/main/java/application/rest/v1/Example.java','Cloudant'); //check Cloudant service present
          assert.fileContent('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-cloudantNoSQLDB-000")');

          assert.fileContent('README.md', 'cloudant');
          assert.fileContent('build.gradle', "compile 'com.cloudant:cloudant-client:2.7.0'");
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('with object storage and maven', function (done) {
      var options = new Options('maven');
      options.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["objectStorage"]}, "objectStorage" : [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},"project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password","auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}]}';
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'bxName', false, true)
          common.assertMavenFiles('bxName');
          frameworkTest.assertMavenFiles();

          assert.fileContent('src/main/webapp/WEB-INF/ibm-web-ext.xml','uri="/bxName"');
          assert.fileContent('src/main/java/application/rest/v1/Example.java','OSClient'); //check Cloudant service present
          assert.fileContent('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-Object-Storage-000")');

          assert.fileContent('README.md', 'Object Storage service');
          assert.fileContent('pom.xml', /<groupId>org\.pacesys<\/groupId>\s*<artifactId>openstack4j-core<\/artifactId>\s*<version>3\.0\.3<\/version>/);
          assert.fileContent('pom.xml', /<groupId>org\.pacesys\.openstack4j\.connectors<\/groupId>\s*<artifactId>openstack4j-httpclient<\/artifactId>\s*<version>3\.0\.3<\/version>/);
          done();
        } catch (err) {
          done(err);
        }
      }, function(err) {
        done(err);
      });                        // Get a Promise back when the generator finishes
    });

    it('with object storage and gradle', function (done) {
      var options = new Options('gradle');
      options.bluemix = '{"name" : "bxName", "server" : {"host": "host", "domain": "domain", "services" : ["objectStorage"]}, "objectStorage" : [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},"project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password","auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}]}';
      helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(options)
        .withPrompts({})
      .toPromise().then(function() {
        try {
          options.assert('bxName', 'bxName', false, true)
          common.assertGradleFiles('bxName');
          frameworkTest.assertGradleFiles();

          assert.fileContent('src/main/webapp/WEB-INF/ibm-web-ext.xml','uri="/bxName"');
          assert.fileContent('src/main/java/application/rest/v1/Example.java','OSClient'); //check Cloudant service present
          assert.fileContent('src/main/java/application/rest/v1/Example.java','@ServiceName(name="test-Object-Storage-000")');

          assert.fileContent('README.md', 'Object Storage service');
          assert.fileContent('build.gradle', "compile 'org.pacesys:openstack4j-core:3.0.3'");
          assert.fileContent('build.gradle', "compile 'org.pacesys.openstack4j.connectors:openstack4j-httpclient:3.0.3'");
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
