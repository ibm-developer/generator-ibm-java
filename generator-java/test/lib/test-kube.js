/*
These sets of tests test if we have generated all the bluemix files.
*/

'use strict'

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const yml = require('js-yaml');
const fs = require('fs');

const LIBERTY = 'liberty';
const SPRING = 'spring';

function test_kube(appName) {
}

test_kube.test = function(appName, exists, framework) {
  describe('Validate k8s for application ' + appName, function() {

    var prefix = exists ? 'generates ' : 'does not generate ';
    var check = exists ? assert.file : assert.noFile;

    it(prefix + 'k8s file Jenkinsfile', function() {
      var expectJenkins = exists && framework === LIBERTY;
      if(expectJenkins) {
        assert.fileContent('Jenkinsfile', 'image = \''+ appName.toLowerCase() + '\'');
      } else {
        assert.noFile('Jenkinsfile');
      }
    });

    it(prefix + 'k8s file kube.deploy.yml', function() {
      check('manifests/kube.deploy.yml');
      if(exists) {
        var i = 0;
        var kubeymlArray = yml.safeLoadAll(fs.readFileSync('manifests/kube.deploy.yml', 'utf8'), data => {
          switch(i) {
            case 0:
              assertYmlContent(data.metadata.name, appName.toLowerCase() + '-service', 'doc0.data.metadata.name');
              assertYmlContent(data.spec.selector.app, appName.toLowerCase() + '-selector', 'doc0.spec.selector.app');
              i++;
              break;
            case 1:
              assertYmlContent(data.metadata.name, appName.toLowerCase() + '-deployment', 'doc1.metadata.name');
              assertYmlContent(data.spec.template.metadata.labels.app, appName.toLowerCase() + '-selector', 'doc1.spec.template.metadata.labels.app');
              assertYmlContent(data.spec.template.spec.containers[0].name, appName.toLowerCase(), 'doc1.spec.template.spec.containers[0].name');
              assertYmlContent(data.spec.template.spec.containers[0].image, appName.toLowerCase() + ':latest', 'doc1.spec.template.spec.containers[0].image');
              if(framework === LIBERTY) {
                assertYmlContent(data.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/' + appName + '/health', 'doc1.spec.template.spec.containers[0].readinessProbe.httpGet.path');
              }
              if(framework === SPRING) {
                assertYmlContent(data.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/health', 'doc1.data.spec.template.spec.containers[0].readinessProbe.httpGet.path');
              }
              i++;
              break;
            default:
              assert.fail(i, 'i < 2', 'Yaml file contains more documents than expected');
          }

        });
      }
    });

    it(prefix + 'helm files', function() {
      check('chart/values.yaml');
      check('chart/Chart.yaml');
      check('chart/templates/deployment.yaml');
      check('chart/templates/service.yaml');
      if(exists) {
        var valuesyml = yml.safeLoad(fs.readFileSync('chart/values.yaml', 'utf8'));
        var chartyml = yml.safeLoad(fs.readFileSync('chart/Chart.yaml', 'utf8'));
        var rawdeploymentyml = fs.readFileSync('chart/templates/deployment.yaml', 'utf8');
        var newdeploymentyml = rawdeploymentyml.replace('"+" "_"', '\\"+\\" \\"_\\"');
        var deploymentyml = yml.safeLoad(newdeploymentyml);
        var rawserviceyml = fs.readFileSync('chart/templates/service.yaml', 'utf8');
        var newserviceyml = rawserviceyml.replace('"+" "_"', '\\"+\\" \\"_\\"');
        var serviceyml = yml.safeLoad(newserviceyml);
        assertYmlContent(valuesyml.image.repository, appName.toLowerCase(), 'valuesyml.image.repository');
        assertYmlContent(chartyml.name, appName, 'chartyml.name');
        if(framework === LIBERTY) {
          assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/' + appName + '/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
        }
        if(framework === SPRING) {
          assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
        }
        assertYmlContent(deploymentyml.metadata.name, '{{  .Chart.Name }}-deployment', 'deploymentyml.metadata.name');
        assertYmlContent(deploymentyml.metadata.labels.chart, '{{ .Chart.Name }}-{{ .Chart.Version | replace \"+\" \"_\" }}', 'deploymentyml.metadata.labels.chart');
        assert.fileContent('chart/templates/deployment.yaml', '  replicas:  {{ .Values.replicaCount }}');
        assert.fileContent('chart/templates/deployment.yaml', '  revisionHistoryLimit: {{ .Values.revisionHistoryLimit }}');
        assertYmlContent(deploymentyml.spec.template.metadata.labels.app, '{{  .Chart.Name }}-selector', 'deploymentyml.spec.template.metadata.labels.app');
        assert.fileContent('chart/templates/deployment.yaml', '      - name: {{  .Chart.Name  }}');
        assertYmlContent(deploymentyml.spec.template.spec.containers[0].image, '{{ .Values.image.repository }}{{ .Values.image.name }}:{{ .Values.image.tag }}', 'deploymentyml.spec.template.spec.containers[0].image');
        assert.fileContent('chart/templates/deployment.yaml', '        imagePullPolicy: {{ .Values.image.pullPolicy }}');
        assertYmlContent(serviceyml.metadata.name, '{{  .Chart.Name }}-service', 'serviceyml.metadata.name');
        assertYmlContent(serviceyml.metadata.labels.chart, '{{ .Chart.Name }}-{{ .Chart.Version | replace \"+\" \"_\" }}');
        assert.fileContent('chart/templates/service.yaml', '  type: {{ .Values.service.type }}');
        assert.fileContent('chart/templates/service.yaml', '    port: {{ .Values.service.servicePort }}');
        assert.fileContent('chart/templates/service.yaml', '    port: {{ .Values.service.servicePortHttps }}');
        assertYmlContent(serviceyml.spec.selector.app, '{{  .Chart.Name }}-selector');
      }
    });

  });
}

var assertYmlContent = function(actual, expected, label) {
  assert.strictEqual(actual, expected, 'Expected ' + label + ' to be ' + expected + ', found ' + actual);
}

module.exports = test_kube;
