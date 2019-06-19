/*
These sets of tests test if we have generated all the bluemix files.
*/

'use strict'

const assert = require('yeoman-assert');
const yml = require('js-yaml');
const fs = require('fs');

const LIBERTY = 'liberty';
const SPRING = 'spring';

function test_kube() {
}

test_kube.test = function(appName, exists, framework, createType) {
  describe('Validate k8s for application ' + appName, function() {

    const prefix = exists ? 'generates ' : 'does not generate ';
    const check = exists ? assert.file : assert.noFile;
    const VALUES_YML = 'chart/' + appName.toLowerCase() + '/values.yaml';
    const CHART_YML = 'chart/' + appName.toLowerCase() + '/Chart.yaml';
    const DEPLOYMENT_YML = 'chart/' + appName.toLowerCase() + '/templates/deployment.yaml';
    const SERVICE_YML = 'chart/' + appName.toLowerCase() + '/templates/service.yaml';

    it(prefix + 'helm files', function() {
      check(VALUES_YML);
      check(CHART_YML);
      check(DEPLOYMENT_YML);
      check(SERVICE_YML);

      if(exists) {
        const valuesyml = yml.safeLoad(fs.readFileSync(VALUES_YML, 'utf8'));
        const chartyml = yml.safeLoad(fs.readFileSync(CHART_YML, 'utf8'));

        const rawdeploymentyml = fs.readFileSync(DEPLOYMENT_YML, 'utf8');
        //comment out helm conditionals so it can be parsed by js-yaml
        const newdeploymentyml = rawdeploymentyml
          .replace('{{ if', '#').replace('{{ else', '#').replace('{{ end', '#')
          .replace('{{- if', '#').replace('{{- end', '#').replace('{{.File','#');
        const deploymentyml = yml.safeLoad(newdeploymentyml);

        const rawserviceyml = fs.readFileSync(SERVICE_YML, 'utf8');
        const newserviceyml = rawserviceyml.replace('"+" "_"', '\\"+\\" \\"_\\"');
        const serviceyml = yml.safeLoad(newserviceyml);

        // values.yaml
        assertYmlContent(valuesyml.image.repository, appName.toLowerCase(), 'valuesyml.image.repository');

        // Chart.yaml
        assertYmlContent(chartyml.name, appName.toLowerCase(), 'chartyml.name');

        // deployment.yaml
        if(framework === LIBERTY) {
          if(createType === 'basicweb') {
            assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/rest/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
          } else {
            assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
          }
        }
        if(framework === SPRING) {
          assertYmlContent(deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/health', 'deploymentyml.spec.template.spec.containers[0].readinessProbe.httpGet.path');
        }

        assertYmlContent(deploymentyml.metadata.name, '{{  .Chart.Name }}-deployment', 'deploymentyml.metadata.name');
        assertYmlContent(deploymentyml.metadata.labels.chart, '{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}', 'deploymentyml.metadata.labels.chart');
        assert.fileContent(DEPLOYMENT_YML, '  replicas: {{ .Values.replicaCount }}');
        assert.fileContent(DEPLOYMENT_YML, '  revisionHistoryLimit: {{ .Values.revisionHistoryLimit }}');
        assertYmlContent(deploymentyml.spec.template.metadata.labels.app, '{{  .Chart.Name }}-selector', 'deploymentyml.spec.template.metadata.labels.app');
        assert.fileContent(DEPLOYMENT_YML, '      - name: "{{  .Chart.Name  }}"');
        assertYmlContent(deploymentyml.spec.template.spec.containers[0].image, '{{ .Values.image.repository }}:{{ .Values.image.tag }}', 'deploymentyml.spec.template.spec.containers[0].image');
        assert.fileContent(DEPLOYMENT_YML, '        imagePullPolicy: {{ .Values.image.pullPolicy }}');

        // service.yaml
        assertYmlContent(serviceyml.metadata.name, '{{  .Chart.Name }}-service', 'serviceyml.metadata.name');
        assertYmlContent(serviceyml.metadata.labels.chart, '{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}');
        assert.fileContent(SERVICE_YML, '  type: {{ .Values.service.type }}');
        assert.fileContent(SERVICE_YML, '    port: {{ .Values.service.servicePort }}');
        if(framework === LIBERTY) {
          assert.fileContent(SERVICE_YML, '    port: {{ .Values.service.servicePortHttps }}');
        }
        assertYmlContent(serviceyml.spec.selector.app, '{{  .Chart.Name }}-selector');
      }
    });

  });
}

const assertYmlContent = function(actual, expected, label) {
  assert.strictEqual(actual, expected, 'Expected ' + label + ' to be ' + expected + ', found ' + actual);
}

module.exports = test_kube;
