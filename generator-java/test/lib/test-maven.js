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

 /* Tests for maven */

'use strict'

var assert = require('yeoman-assert');
const BUILD_FILE = 'pom.xml'


var assertApplication = function(appname, groupId, artifactId, version) {
  it('does not generate a build.gradle', function() {
    assert.noFile('build.gradle');
  });
  it('does not generate a settings.gradle', function() {
    assert.noFile('settings.gradle');
  });
  it('generates a ' + BUILD_FILE + ' file', function() {
    assert.file(BUILD_FILE);
    assert.fileContent(BUILD_FILE,"<app.name>" + appname + "</app.name>");
    assert.fileContent(BUILD_FILE,"<groupId>" + groupId + "</groupId>");
    assert.fileContent(BUILD_FILE,"<artifactId>" + artifactId + "</artifactId>");
    assert.fileContent(BUILD_FILE,"<version>" + version + "</version>");
  });
}

var assertBluemix = function(appname) {
  it('manifest.yml contains a path to a zip file with the same name as the application (' + appname + ')'), function() {
    assert.fileContent('manifest.yml', 'path: ./target/' + appname + '.zip');
  }
}

var assertMavenProperty = function(name, value) {
  it(BUILD_FILE + ' contains a property called ' + name + ' with a value of ' + value, function() {
    assert.fileContent(BUILD_FILE, '<' + name + '>' + value + '</' + name + '>');
  });
}

var assertContent = function(value) {
  it(BUILD_FILE + ' contains content a value of ' + value, function() {
    assert.fileContent(BUILD_FILE, value);
  });

}

var assertMavenDependency = function(scope, groupId, artifactId, version) {
  it(BUILD_FILE + ' contains a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function() {
    groupId = groupId.replace(/\./g, '\\.');
    artifactId = artifactId.replace(/\./g, '\\.');
    version = version.replace(/\./g, '\\.');
    assert.fileContent(BUILD_FILE, new RegExp('<dependency>\\s*<groupId>' + groupId + '</groupId>\\s*<artifactId>' + artifactId + '</artifactId>\\s*<version>' + version + '</version>\\s*<scope>' + scope + '</scope>\\s*</dependency>'));
  });
}

module.exports = {
  assertApplication : assertApplication,
  assertContent : assertContent,
  assertBluemix : assertBluemix,
  assertMavenProperty : assertMavenProperty,
  assertMavenDependency : assertMavenDependency
}
