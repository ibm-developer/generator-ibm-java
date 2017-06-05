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

 /* Tests for gradle */

'use strict'

var assert = require('yeoman-assert');
const BUILD_FILE = 'build.gradle';
const SETTINGS_FILE = 'settings.gradle';

function test_gradle() {
}

test_gradle.prototype.assertApplication = function(appname, groupId, artifactId, version) {
  it('does not generate a pom.xml', function() {
    assert.noFile('pom.xml');   //build file
  });

  it('generates a build.gradle and settings.gradle file', function() {
    assert.file(BUILD_FILE);
    assert.file(SETTINGS_FILE);
    assert.fileContent(BUILD_FILE,"appName = '" + appname +"'");
    assert.fileContent(BUILD_FILE, "group = '" + groupId + "'");
    assert.fileContent(BUILD_FILE, "version = '" + version + "'");
    assert.fileContent(SETTINGS_FILE, "rootProject.name = '" + artifactId + "'");
  });
}


test_gradle.prototype.assertBluemix = function(appname) {
  it('manifest.yml contains a path to a zip file with the same name as the application (' + appname + ')'), function() {
    assert.fileContent('manifest.yml', 'path: ./build/' + appname + '.zip');
  }
}

test_gradle.prototype.assertProperty = function(name, value) {
  it('build.gradle contains a property called ' + name + ' with a value of ' + value, function() {
    assert.fileContent(BUILD_FILE, name + ' = ' + value);
  });

}

test_gradle.prototype.assertContent = function(value) {
  it('build.gradle contains content a value of ' + value, function() {
    assert.fileContent(BUILD_FILE, value);
  });

}

test_gradle.prototype.assertDependency = function(scopeName, groupId, artifactId, version, exclusions) {
  var scope = convertScope(scopeName);
  it(BUILD_FILE + ' contains a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function() {
    assert.fileContent(BUILD_FILE, constructRegex(scope, groupId, artifactId, version, exclusions));
  });
}

test_gradle.prototype.assertNoDependency = function(scopeName, groupId, artifactId, version, exclusions) {
  var scope = convertScope(scopeName);
  it(BUILD_FILE + ' does not contain a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function() {
    assert.noFileContent(BUILD_FILE, constructRegex(scope, groupId, artifactId, version, exclusions));
  });
}

var constructRegex = function(scope, groupId, artifactId, version, exclusions) {
  groupId = groupId.replace(/\./g, '\\.');
  artifactId = artifactId.replace(/\./g, '\\.');
  version = version.replace(/\./g, '\\.');
  var content = scope + "\\s*\\('" + groupId + ':' + artifactId + ':' + version + "'\\)";
  if(exclusions) {
    content += '\\s*\\{';
    for(var i=0; i < exclusions.length; i++) {
      content += "\\s*exclude group:\\s*'" + exclusions[i].groupId.replace(/\./g, '\\.') + "',\\s*module:\\s*'" + exclusions[i].artifactId.replace(/\./g, '\\.') + "'";
    }
    content += '\\s*\\}';
  }
  return new RegExp(content);
}

var convertScope = function(scope) {
  switch(scope) {
    case 'provided':
      return 'providedCompile';
    case 'test':
      return 'testCompile';
    case 'compile':
      return 'compile';
    default:
      throw "convertScope error : expected one of provided or test";
  }
}

module.exports = test_gradle;
