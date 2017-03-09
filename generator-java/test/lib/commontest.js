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

//common test functions in a handy module

var assert = require('yeoman-assert');

var assertCommonFiles = function() {
  //check common files are present for all configurations
  assert.noFile('src/main/java/application/api/v1/HealthEndpoint.java'); //application files
  assert.noFile('src/test/java/it/HealthEndpointTest.java');    //some tests
  assert.file('src/main/liberty/config/server.xml');    //liberty configuration
  assert.file('src/main/liberty/config/server.env');
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
  assert.file('kube.deploy.yml');
  // Liber8 files
  assert.file('Jenkinsfile');
}

var assertCommonGradleFiles = function(appname) {
  assert.noFile('pom.xml');   //build file
  assert.file('build.gradle');
  assert.fileContent('build.gradle',"appName = '" + appname +"'");
  assert.fileContent('cli-config.yml','image-name-run : "bx-dev-" + appname +""');  //make sure lowercase app name
  // Bluemix files
  assert.noFileContent('manifest.yml', 'cloudant');
  assert.noFileContent('.bluemix/pipeline.yml', 'cloudant');
  assert.noFile('src/main/java/application/bluemix/InvalidCredentialsException.java');
  assert.noFile('src/main/java/application/bluemix/VCAPServices.java');
  // Liber8 files
  assert.fileContent('Jenkinsfile',"utils.dockerBuild('" + appname + "')");
}

var assertCommonMavenFiles = function(appname) {
  assert.noFile('build.gradle');   //build file
  assert.file('pom.xml');
  assert.fileContent('pom.xml',"<app.name>" + appname +"</app.name>");
  assert.fileContent('cli-config.yml','image-name-run : "bx-dev-" + appname + "');  //make sure lowercase app name
  // Bluemix files
  assert.noFileContent('manifest.yml', 'cloudant');
  assert.noFileContent('.bluemix/pipeline.yml', 'cloudant');
  assert.noFile('src/main/java/application/bluemix/InvalidCredentialsException.java');
  assert.noFile('src/main/java/application/bluemix/VCAPServices.java');
  // Liber8 files
  assert.fileContent('Jenkinsfile',"utils.dockerBuild('" + appname +"')");
}

var assertNoServices = function() {
  for(var i=0; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      assert.noFileContent('manifest.yml', arguments[i]);
      assert.noFileContent('.bluemix/pipeline.yml', arguments[i]);
    }
  }
}

module.exports = {
  assertCommonFiles : assertCommonFiles,
  assertCommonGradleFiles : assertCommonGradleFiles,
  assertNoServices :assertNoServices
}
