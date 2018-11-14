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
 * Provides the assertions for testing Liberty code and config from this generator
 */
'use strict';

const assert = require('yeoman-assert');
const constant = require('./constant.js')
const SERVER_XML = 'src/main/liberty/config/server.xml';
const SERVER_ENV = 'src/main/liberty/config/server.env';
const README_MD = 'README.md';
const JVM_OPTIONS = 'src/main/liberty/config/jvm.options';
const IBM_WEB_EXT = 'src/main/webapp/WEB-INF/ibm-web-ext.xml';
const JVM_OPTIONS_JAVAAGENT = '-javaagent:resources/javametrics-agent.jar';

const tests = require('../../../lib/common');
const escapeStringRegexp = require('escape-string-regexp');

//handy function for checking both existence and non-existence
function getCheck(exists) {
  return {
    file: exists ? assert.file : assert.noFile,
    desc: exists ? 'should create ' : 'should not create ',
    content: exists ? assert.fileContent : assert.noFileContent
  }
}

function getBuildCheck(exists, buildType) {
  return {
    content: exists ? tests.test(buildType).assertContent : tests.test(buildType).assertNoContent
  }
}

function AssertLiberty() {
  this.assertAllFiles = function (exists) {
    const check = getCheck(exists);
    it(check.desc + 'server.xml, server.env, jvm.options and ibm-web-ext.xml', function () {
      check.file(SERVER_XML);
      check.file(SERVER_ENV);
      check.file(IBM_WEB_EXT);
      check.file(JVM_OPTIONS);
    });
  }

  this.assertJavaMetrics = function (exists, buildType) {
    const check = getCheck(exists);
    const self = this;
    describe(check.desc + 'javametrics code, dependencies or features', function () {
      it(check.desc + 'jvm.options with ' + JVM_OPTIONS_JAVAAGENT, function () {
        check.content(JVM_OPTIONS, JVM_OPTIONS_JAVAAGENT);
      });

      self.assertFeature(exists, "jsp-2.3");
      self.assertFeature(exists, "servlet-3.1");
      self.assertFeature(exists, "managedBeans-1.0");
      self.assertFeature(exists, "websocket-1.1");

      const depcheck = exists ? tests.test(buildType).assertDependency : tests.test(buildType).assertNoDependency;
      depcheck('provided', 'com.ibm.runtimetools', 'javametrics-agent', '\\[1.2,2.0\\)');
      depcheck('provided', 'com.ibm.runtimetools', 'javametrics-rest', '\\[1.2,2.0\\)');
      depcheck('provided', 'com.ibm.runtimetools', 'javametrics-dash', '\\[1.2,2.0\\)');
    });
  }

  this.assertVersion = function (buildType, libertyVersion) {
    describe('contains Liberty version ' + libertyVersion, function () {
      const check = getBuildCheck(true, buildType);
      if (libertyVersion === 'beta') {
        if (buildType === 'gradle') {
          check.content('version = "' + constant.libertyBetaVersion + '"');
        }
        if (buildType === 'maven') {
          const betaVersion = constant.libertyBetaVersion.replace(/\./g, '\\.').replace(/\+/g, '\\+');
          const betaContent = '<install>\\s*<type>webProfile7</type>\\s*<version>' + betaVersion + '</version>\\s*</install>';
          const betaRegex = new RegExp(betaContent);
          check.content(betaRegex);
        }
      } else {
        if (buildType === 'gradle') {
          check.content('wlp-webProfile7:' + constant.libertyVersion);
        }
        if (buildType === 'maven') {
          const groupId = escapeStringRegexp('com.ibm.websphere.appserver.runtime');
          const artifactId = escapeStringRegexp('wlp-webProfile7');
          const version = escapeStringRegexp(constant.libertyVersion);

          const content = '<assemblyArtifact>\\s*<groupId>' + groupId + '</groupId>\\s*<artifactId>' + artifactId + '</artifactId>\\s*<version>' + version + '</version>\\s*<type>zip</type>\\s*</assemblyArtifact>';
          const regex = new RegExp(content);
          check.content(regex);
        }
      }
    });
  }

  this.assertNotLoose = function (buildType) {
    if (buildType === 'maven') {
      const check = getBuildCheck(true, buildType);
      check.content(new RegExp('<looseApplication>false</looseApplication>'));
    }
  }

  this.assertArtifactID = function (buildType, id) {
    const check = getBuildCheck(true, buildType);
    if (buildType === 'gradle') {
      it('settings.gradle contains root project setting of ' + id, function () {
        assert.fileContent('settings.gradle', 'rootProject.name = \'' + id + '\'');
      });
    }
    if (buildType === 'maven') {
      check.content('<artifactId>' + id + '</artifactId>');
    }
  }

  this.assertProperties = function (buildType) {
    const check = tests.test(buildType).assertProperty;
    check('testServerHttpPort', '9080');
    check('testServerHttpsPort', '9443');
    if (buildType === 'gradle') {
      check('serverDirectory', '"${buildDir}/wlp/usr/servers/defaultServer"');
      check('packageFile', '"${project.buildDir}/${rootProject.name}-${version}.zip"');
      check('packagingType', "'usr'");
    }
    if (buildType === 'maven') {
      check('package.file', '${project.build.directory}/${project.artifactId}-${project.version}.zip');
      check('packaging.type', 'usr');
    }
  }

  this.assertJNDI = function (exists, name, value) {
    const check = getCheck(exists);
    it(check.desc + 'a server.xml JDNI entry for ' + name + " = " + value, function () {
      check.content(SERVER_XML, '<jndiEntry jndiName="' + name + '" value="' + value + '"/>');
    });
  }

  this.assertEnv = function (exists, name, value) {
    const check = getCheck(exists);
    it(check.desc + 'a server.env entry for ' + name + " = " + value, function () {
      check.content(SERVER_ENV, name + '="' + value + '"');
    });
  }

  this.assertContextRoot = function () {
    it('contains a ibm-web-ext.xml context root of /', function () {
      assert.fileContent(SERVER_XML, 'contextRoot="/"');
    });
  }

  this.assertFeature = function (exists, name) {
    const check = getCheck(exists);
    it(SERVER_XML + ' ' + check.desc + 'a feature for ' + name, function () {
      check.content(SERVER_XML, "<feature>" + name + "</feature>");
    });
  }

  this.assertConfig = function (exists, name) {
    const check = getCheck(exists);
    it(SERVER_XML + ' ' + check.desc + 'a tag for ' + name, function () {
      //look for the closing tag as that will not contain optional attiributes
      check.content(SERVER_XML, "</" + name + ">");
    });
  }

  this.assertPlatforms = function (platforms, buildType, appName) {
    describe('checks build steps for deploying to IBM Cloud', function () {
      const buildCheck = getBuildCheck(platforms.includes('bluemix'), buildType);
      const check = getCheck(platforms.includes('bluemix'));
      if (buildType === 'gradle') {
        buildCheck.content("classpath 'org.cloudfoundry:cf-gradle-plugin:1.1.2'");
        buildCheck.content("cfContext = 'mybluemix.net'");
        buildCheck.content("apply plugin: 'cloudfoundry'");
        buildCheck.content('task checkBluemixPropertiesSet()');
        buildCheck.content("task printBluemixProperties(dependsOn: 'checkBluemixPropertiesSet')");
        buildCheck.content('def checkPropertySet(propertyName)');
        buildCheck.content('cloudfoundry {');
        buildCheck.content("cfPush.dependsOn 'printBluemixProperties'");
        it(check.desc + 'README with gradle deployment instructions', function () {
          check.content(README_MD, 'gradle build cfPush -PcfOrg=[your email address] -PcfUsername=[your username] -PcfPassword=[your password]');
        });
      }
      if (buildType === 'maven') {
        const profileContent = '<profile>\\s*<id>bluemix</id>';
        const profileRegex = new RegExp(profileContent);
        buildCheck.content(profileRegex);
        const propertyContent = '<cf.context>mybluemix.net</cf.context>';
        const propertyRegex = new RegExp(propertyContent);
        buildCheck.content(propertyRegex);
        it(check.desc + 'README with maven deployment instructions', function () {
          check.content(README_MD, 'mvn install -Pbluemix -Dcf.org=[your email address] -Dcf.username=[your username] -Dcf.password=[your password]');
        });
      }
      it(check.desc + 'README deployment instructions', function () {
        check.content(README_MD, '**Create Toolchain** button');
        check.content(README_MD, 'contains IBM Cloud specific files');
        check.content(README_MD, 'To deploy the application to IBM Cloud:');
        check.content(README_MD, 'The application will be deployed to the following url: [http://' + appName + '.mybluemix.net/' + appName + '/]');
      });
    });
  }
}

module.exports = exports = AssertLiberty;
