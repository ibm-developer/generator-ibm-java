/*
 * © Copyright IBM Corp. 2017, 2018
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
 * Provides the assertions for testing code from this generator
 */
'use strict';
const assert = require('yeoman-assert');
const INDEX_HTML = 'src/main/webapp/index.html';
const README_MD = 'README.md';
const tests = require('../../../lib/common');
const AssertLiberty = require('./assert.liberty');
const liberty = new AssertLiberty();

function AssertTech() {
  this.assert = function() {
    it('generates an ' + INDEX_HTML, function() {
      assert.file(INDEX_HTML);
    });
    it('generates sample test files', function() {
      assert.file('src/test/java/it/EndpointTest.java');
      assert.file('src/test/java/it/TestApplication.java');
    });
    liberty.assertAllFiles(true);
    liberty.assertContextRoot();
  }
  this.assertpicnmix = function(name) {
    this.assert(name);    //there are no additional files to check for
    it('generates a ' + README_MD, function() {
      assert.file(README_MD);
    });
  }
  this.assertmsbuilderwithname = function(name) {
    it('adds kube.deploy.yml file with name inserted', function() {
      assert.fileContent('manifests/kube.deploy.yml', 'name: "' + name.toLowerCase() + '-service"');
      assert.fileContent('manifests/kube.deploy.yml', 'app: "' + name.toLowerCase() + '-selector"');
      assert.fileContent('manifests/kube.deploy.yml', 'name: "' + name.toLowerCase() + '-deployment"');
      assert.fileContent('manifests/kube.deploy.yml', '- name: ' + name.toLowerCase());
      assert.fileContent('manifests/kube.deploy.yml', 'image: ' + name.toLowerCase() + ':latest');
    });
    it('adds Jenkinsfile with name inserted', function() {
      assert.fileContent('Jenkinsfile', "image = '" + name.toLowerCase() + "'");
    });
  }
  this.assertrest = function(buildType) {
    it('generates sample file LibertyRestEndpoint.java', function() {
      assert.file('src/main/java/application/rest/LibertyRestEndpoint.java');
    });
    it('generates sample file LibertyRestEndpoinTestIT.java', function() {
      assert.file('src/test/java/it/rest/LibertyRestEndpointTestIT.java');
    });
    it('generates an ' + INDEX_HTML + ' file with a rest section', function() {
      assert.fileContent(INDEX_HTML, '<h2>REST</h2>');
    });
    it('generates a ' + README_MD + ' file with a rest section', function() {
      assert.fileContent(README_MD, '**REST**');
    });
    tests.test(buildType).assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
    tests.test(buildType).assertDependency('provided', 'javax.json', 'javax.json-api', '1.0');
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.18');
    liberty.assertFeature(true, 'jaxrs-2.0');
    liberty.assertFeature(true, 'jsonp-1.0');
  }
  this.assertmsbuilder = function(buildType) {
    it('adds MS Builder section to ' + INDEX_HTML, function() {
      assert.fileContent(INDEX_HTML, '<h2>Microservice Builder</h2>');
    });
    it('generates a ' + README_MD + ' file with a microprofile section', function() {
      assert.fileContent(README_MD, '**Microservice Builder**');
    });
    this.assertmicroprofiledep(buildType);
  }
  this.assertmicroprofile = function(buildType) {
    it('generates an ' + INDEX_HTML + ' file with a microprofile section', function() {
      assert.fileContent(INDEX_HTML, '<h2>MicroProfile</h2>');
    });
    it('generates a ' + README_MD + ' file with a microprofile section', function() {
      assert.fileContent(README_MD, '**MicroProfile**');
    });
    this.assertmicroprofiledep(buildType);
  }
  this.assertmicroprofiledep = function(buildType) {
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.18');
    liberty.assertFeature(true, 'microprofile-1.2');
  }
  this.assertpersistence = function(buildType) {
    it('generates an index.html file with a persistence section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Persistence</h2>');
    });
    it('generates an README.md file with a persistence section', function() {
      assert.fileContent(README_MD, '**Persistence**');
    });
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.persistence', '1.0.18');
    tests.test(buildType).assertDependency('provided', 'org.eclipse.persistence', 'javax.persistence', '2.1.0');
    liberty.assertFeature(true, 'jpa-2.1');
  }
  this.assertwebsocket = function(buildType) {
    it('generates an ' + INDEX_HTML + ' file with a websocket section', function() {
      assert.fileContent(INDEX_HTML, '<h2>WebSockets</h2>');
    });
    it('generates a ' + README_MD + ' file with a websocket section', function() {
      assert.fileContent(README_MD, '**Websockets**');
    });
    tests.test(buildType).assertDependency('provided', 'javax.websocket', 'javax.websocket-api', '1.1');
    liberty.assertFeature(true, 'websocket-1.1');
  }
  this.assertweb = function(buildType) {
    it('generates an ' + INDEX_HTML + ' file with a servlet section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Servlet</h2>');
    });
    it('generates a ' + README_MD + ' file with a servlet section', function() {
      assert.fileContent(README_MD, '**Servlet**');
    });
    tests.test(buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.1.18');
    liberty.assertFeature(true, 'servlet-3.1');
  }
  this.assertwatsonsdk = function(buildType) {
    it('generates an ' + INDEX_HTML + ' file with a Watson SDK section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Watson SDK</h2>');
    });
    it('generates a ' + README_MD + ' file with a Watson SDK section', function() {
      assert.fileContent(README_MD, '**Watson SDK**');
    });
    tests.test(buildType).assertDependency('compile', 'com.ibm.watson.developer_cloud', 'java-sdk', '3.5.1');
  }
  this.assertswagger = function(buildType) {
    it('generates an '+ INDEX_HTML + ' file with a Swagger section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Swagger</h2>');
    });
    it('generates a ' + README_MD + ' file with a swagger section', function() {
      assert.fileContent(README_MD, '**Swagger**');
    });
    tests.test(buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.1.18');
    tests.test(buildType).assertDependency('provided', 'io.swagger', 'swagger-annotations', '1.5.3');
    liberty.assertFeature(true, 'apiDiscovery-1.0');
  }
  this.assertspringbootweb = function(buildType) {
    it('generates an' + INDEX_HTML + ' file with a Spring Boot section', function() {
      assert.fileContent(INDEX_HTML, '<h2>Spring Boot with Spring MVC</h2>');
    });
    it('generates a ' + README_MD + ' file with a Springboot section', function() {
      assert.fileContent(README_MD, '**Springboot**');
    });
    tests.test(buildType).assertDependency('provided', 'javax.servlet', 'javax.servlet-api', '3.1.0');
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.servlet', '1.1.18');
    const exclusions = [{"groupId" : "org.springframework.boot", "artifactId" : "spring-boot-starter-tomcat"}];
    tests.test(buildType).assertDependency('compile', 'org.springframework.boot', 'spring-boot-starter-web', '1.3.0.RELEASE', exclusions);
  }
  this.assertspringbootwebonly = function(buildType) {
    tests.test(buildType).assertNoDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    tests.test(buildType).assertNoDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
    liberty.assertFeature(false, 'jaxrs-2.0');
    it('does not generate JAX-RS dependent source files', function() {
      assert.noFile("src/main/java/application/rest/HealthEndpoint.java");
      assert.noFile("src/test/java/it/HealthEndpointIT.java");
    });
  }
  this.asserthealthdeps = function(buildType) {
    tests.test(buildType).assertDependency('provided', 'javax.ws.rs', 'javax.ws.rs-api', '2.0.1');
    tests.test(buildType).assertDependency('provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.jaxrs20', '1.0.18');
    liberty.assertFeature(true, 'jaxrs-2.0');
  }
}

module.exports = exports = AssertTech;
