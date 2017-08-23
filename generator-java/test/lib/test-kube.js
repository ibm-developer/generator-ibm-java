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

const JENKINSFILE = 'Jenkinsfile';
const KUBE_YML = 'manifests/kube.deploy.yml';

function test_kube(appName) {
}

test_kube.test = function(appName, exists, framework, createType) {
  describe('Validate k8s for application ' + appName, function() {

    var prefix = exists ? 'generates ' : 'does not generate ';
    var check = exists ? assert.file : assert.noFile;
    var VALUES_YML = 'chart/' + appName.toLowerCase() + '/values.yaml';
    var CHART_YML = 'chart/' + appName.toLowerCase() + '/Chart.yaml';
    var DEPLOYMENT_YML = 'chart/' + appName.toLowerCase() + '/templates/deployment.yaml';
    var SERVICE_YML = 'chart/' + appName.toLowerCase() + '/templates/service.yaml';

    it(prefix + 'k8s file ' + JENKINSFILE, function() {
      var expectJenkins = exists && framework === LIBERTY;
      if(expectJenkins) {
        assert.fileContent(JENKINSFILE, 'image = \''+ appName.toLowerCase() + '\'');
      } else {
        assert.noFile(JENKINSFILE);
      }
    });

    it(prefix + 'k8s file kube.deploy.yml', function() {
      check(KUBE_YML);
      if(exists) {
        var i = 0;
        var kubeymlArray = yml.safeLoadAll(fs.readFileSync(KUBE_YML, 'utf8'), data => {
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
                if(createType === 'basicweb') {
                  assertYmlContent(data.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/' + appName + '/rest/health', 'doc1.spec.template.spec.containers[0].readinessProbe.httpGet.path');
                } else {
                  assertYmlContent(data.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/' + appName + '/health', 'doc1.spec.template.spec.containers[0].readinessProbe.httpGet.path');
                }
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
      check(VALUES_YML);
      check(CHART_YML);
      check(DEPLOYMENT_YML);
      check(SERVICE_YML);
      if(exists) {
        var valuesyml = yml.safeLoad(fs.readFileSync(VALUES_YML, 'utf8'));
        var chartyml = yml.safeLoad(fs.readFileSync(CHART_YML, 'utf8'));
        var rawdeploymentyml = fs.readFileSync(DEPLOYMENT_YML, 'utf8');
        var newdeploymentyml = rawdeploymentyml.replace('"+" "_"', '\\"+\\" \\"_\\"');
        var deploymentyml = yml.safeLoad(newdeploymentyml);
        var rawserviceyml = fs.readFileSync(SERVICE_YML, 'utf8');
        var newserviceyml = rawserviceyml.replace('"+" "_"', '\\"+\\" \\"_\\"');
        var serviceyml = yml.safeLoad(newserviceyml);
        assertYmlContent(valuesyml.image.repository, appName.toLowerCase(), 'valuesyml.image.repository');
        assertYmlContent(chartyml.name, appName.toLowerCase(), 'chartyml.name');
        if(framework === LIBERTY) {
          if(createType === 'basicweb') {
            assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/' + appName + '/rest/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
          } else {
            assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/' + appName + '/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
          }
        }
        if(framework === SPRING) {
          assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
        }
        assertYmlContent(deploymentyml.metadata.name, '{{  .Chart.Name }}-deployment', 'deploymentyml.metadata.name');
        assertYmlContent(deploymentyml.metadata.labels.chart, '{{ .Chart.Name }}-{{ .Chart.Version | replace \"+\" \"_\" }}', 'deploymentyml.metadata.labels.chart');
        assert.fileContent(DEPLOYMENT_YML, '  replicas:  {{ .Values.replicaCount }}');
        assert.fileContent(DEPLOYMENT_YML, '  revisionHistoryLimit: {{ .Values.revisionHistoryLimit }}');
        assertYmlContent(deploymentyml.spec.template.metadata.labels.app, '{{  .Chart.Name }}-selector', 'deploymentyml.spec.template.metadata.labels.app');
        assert.fileContent(DEPLOYMENT_YML, '      - name: {{  .Chart.Name  }}');
        assertYmlContent(deploymentyml.spec.template.spec.containers[0].image, '{{ .Values.image.repository }}:{{ .Values.image.tag }}', 'deploymentyml.spec.template.spec.containers[0].image');
        assert.fileContent(DEPLOYMENT_YML, '        imagePullPolicy: {{ .Values.image.pullPolicy }}');
        assertYmlContent(serviceyml.metadata.name, '{{  .Chart.Name }}-service', 'serviceyml.metadata.name');
        assertYmlContent(serviceyml.metadata.labels.chart, '{{ .Chart.Name }}-{{ .Chart.Version | replace \"+\" \"_\" }}');
        assert.fileContent(SERVICE_YML, '  type: {{ .Values.service.type }}');
        assert.fileContent(SERVICE_YML, '    port: {{ .Values.service.servicePort }}');
        assert.fileContent(SERVICE_YML, '    port: {{ .Values.service.servicePortHttps }}');
        assertYmlContent(serviceyml.spec.selector.app, '{{  .Chart.Name }}-selector');
      }
    });

  });
}

var assertYmlContent = function(actual, expected, label) {
  assert.strictEqual(actual, expected, 'Expected ' + label + ' to be ' + expected + ', found ' + actual);
}

module.exports = test_kube;
