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
        assert.fileContent('Jenkinsfile', 'image = \''+ appName.toLowerCase() + '\'');
      }
    });

    it(prefix + 'k8s file kube.deploy.yml', function() {
      check('manifests/kube.deploy.yml');
      if(exists) {
        assert.fileContent('manifests/kube.deploy.yml', 'name: "' + appName.toLowerCase() + '-deployment"');
        assert.fileContent('manifests/kube.deploy.yml', 'name: "' + appName.toLowerCase() + '-service"');
        assert.fileContent('manifests/kube.deploy.yml', 'app: "' + appName.toLowerCase() + '-selector"');
        assert.fileContent('manifests/kube.deploy.yml', 'image: ' + appName.toLowerCase() + ':latest');
        assert.fileContent('manifests/kube.deploy.yml', 'path: /' + appName + '/health');
      }
    });

    it(prefix + 'helm files', function() {
      check('chart/values.yaml');
      check('chart/Chart.yaml');
      check('chart/templates/deployment.yaml');
      check('chart/templates/service.yaml');
      if(exists) {
        assert.fileContent('chart/values.yaml', 'repository: ' + appName.toLowerCase());
        assert.fileContent('chart/Chart.yaml', 'name: ' + appName);
        assert.fileContent('chart/templates/deployment.yaml', 'path: /' + appName + '/health');
        assert.fileContent('chart/templates/deployment.yaml', 'name: "{{  .Chart.Name }}-deployment"');
        assert.fileContent('chart/templates/deployment.yaml', 'chart: "{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}"');
        assert.fileContent('chart/templates/deployment.yaml', 'replicas:  {{ .Values.replicaCount }}');
        assert.fileContent('chart/templates/deployment.yaml', 'revisionHistoryLimit: {{ .Values.revisionHistoryLimit }}');
        assert.fileContent('chart/templates/deployment.yaml', '- name: {{  .Chart.Name  }}');
        assert.fileContent('chart/templates/deployment.yaml', '{{  .Chart.Name  }}');
        assert.fileContent('chart/templates/deployment.yaml', 'image: "{{ .Values.image.repository }}{{ .Values.image.name }}:{{ .Values.image.tag }}"');
        assert.fileContent('chart/templates/deployment.yaml', 'imagePullPolicy: {{ .Values.image.pullPolicy }}');
        assert.fileContent('chart/templates/service.yaml', 'name: "{{  .Chart.Name }}-service"');
        assert.fileContent('chart/templates/service.yaml', 'chart: "{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}"');
        assert.fileContent('chart/templates/service.yaml', 'type: {{ .Values.service.type }}');
        assert.fileContent('chart/templates/service.yaml', 'port: {{ .Values.service.servicePort }}');
        assert.fileContent('chart/templates/service.yaml', 'port: {{ .Values.service.servicePortHttps }}');
        assert.fileContent('chart/templates/service.yaml', 'app: "{{  .Chart.Name }}-selector"');
      }
    });

  });
}


module.exports = test_kube;
