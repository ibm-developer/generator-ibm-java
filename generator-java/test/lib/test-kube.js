/*
These sets of tests test if we have generated all the bluemix files.
*/

'use strict'

var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

function test_kube(appName) {
}

test_kube.test = function(appName, exists) {
  describe('Validate k8s for application ' + appName, function() {

    var prefix = exists ? 'generates ' : 'does not generate ';
    var check = exists ? assert.file : assert.noFile;

    it(prefix + 'k8s file Jenkinsfile', function() {
      check('Jenkinsfile');
      if(exists) {
        assert.fileContent('Jenkinsfile', 'dockerBuild(\''+ appName + '\')');
      }
    });

    it(prefix + 'k8s file kube.deploy.yml', function() {
      check('manifests/kube.deploy.yml');
      if(exists) {
        assert.fileContent('manifests/kube.deploy.yml', 'name: "' + appName + '-deployment"');
        assert.fileContent('manifests/kube.deploy.yml', 'name: "' + appName + '-service"');
        assert.fileContent('manifests/kube.deploy.yml', 'app: "' + appName + '-selector"');
      }
    });

  });
}


module.exports = test_kube;
