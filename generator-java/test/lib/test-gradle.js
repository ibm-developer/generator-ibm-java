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


var assertApplication = function(appname, groupId, artifactId, version) {
  it('does not generate a pom.xml', function() {
    assert.noFile('pom.xml');   //build file
  });

  it('generates a build.gradle and settings.gradle file', function() {
    assert.file('build.gradle');
    assert.file('settings.gradle');
    assert.fileContent('build.gradle',"appName = '" + appname +"'");
    assert.fileContent('build.gradle', "group = '" + groupId + "'");
    assert.fileContent('build.gradle', "version = '" + version + "'");
    assert.fileContent('settings.gradle', "rootProject.name = '" + artifactId + "'");
  });
}


var assertBluemix = function(appname) {
  it('manifest.yml contains a path to a zip file with the same name as the application (' + appname + ')'), function() {
    assert.fileContent('manifest.yml', 'path: ./build/' + appname + '.zip');
  }
}

var assertGradleProperty = function(name, value) {
  it('build.gradle contains a property called ' + name + ' with a value of ' + value, function() {
    assert.fileContent('build.gradle', name + ' = ' + value);
  });

}

var assertContent = function(value) {
  it('build.gradle contains content a value of ' + value, function() {
    assert.fileContent('build.gradle', value);
  });

}

var assertGradleDependency = function(scope, groupId, artifactId, version) {
  it('build.gradle contains a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function() {
    assert.fileContent('build.gradle', scope + " '" + groupId + ':' + artifactId + ':' + version + "'");
  });
}

module.exports = {
  assertApplication : assertApplication,
  assertContent : assertContent,
  assertBluemix : assertBluemix,
  assertGradleProperty : assertGradleProperty,
  assertGradleDependency : assertGradleDependency
}
