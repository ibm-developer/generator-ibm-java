/*
These sets of tests test if we have generated all the bluemix files.
*/

'use strict'

const assert = require('yeoman-assert');
const yml = require('js-yaml');
const fs = require('fs');

const LIBERTY = 'liberty';
const SPRING = 'spring';

const JENKINSFILE = 'Jenkinsfile';
const KUBE_YML = 'manifests/kube.deploy.yml';

function test_kube() {
}

test_kube.test = function(appName, exists, framework, createType, cloudantExists, objectStorageExists) {
  describe('Validate k8s for application ' + appName, function() {

    const prefix = exists ? 'generates ' : 'does not generate ';
    const check = exists ? assert.file : assert.noFile;
    const VALUES_YML = 'chart/' + appName.toLowerCase() + '/values.yaml';
    const BINDINGS_YML = 'chart/' + appName.toLowerCase() + '/bindings.yaml';
    const CHART_YML = 'chart/' + appName.toLowerCase() + '/Chart.yaml';
    const DEPLOYMENT_YML = 'chart/' + appName.toLowerCase() + '/templates/deployment.yaml';
    const SERVICE_YML = 'chart/' + appName.toLowerCase() + '/templates/service.yaml';

    it(prefix + 'k8s file ' + JENKINSFILE, function() {
      if(exists) {
        assert.fileContent(JENKINSFILE, 'image = \''+ appName.toLowerCase() + '\'');
      } else {
        assert.noFile(JENKINSFILE);
      }
    });

    it(prefix + 'k8s file kube.deploy.yml', function() {
      check(KUBE_YML);
      if(exists) {
        let i = 0;
        yml.safeLoadAll(fs.readFileSync(KUBE_YML, 'utf8'), data => {
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
                  assertYmlContent(data.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/rest/health', 'doc1.spec.template.spec.containers[0].readinessProbe.httpGet.path');
                } else {
                  assertYmlContent(data.spec.template.spec.containers[0].readinessProbe.httpGet.path, '/health', 'doc1.spec.template.spec.containers[0].readinessProbe.httpGet.path');
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
        const valuesyml = yml.safeLoad(fs.readFileSync(VALUES_YML, 'utf8'));
        const chartyml = yml.safeLoad(fs.readFileSync(CHART_YML, 'utf8'));
        const bindingsyml = yml.safeLoad(fs.readFileSync(BINDINGS_YML, 'utf8'));

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

        // There should be bindings (for secrets) in the bindings.yml
        if ( cloudantExists ) {
          const cloudantBinding = bindingsyml.filter(element => element.name === "service_cloudant");
          assert.equal(cloudantBinding.length > 0, cloudantExists,
            BINDINGS_YML + ' should' +(cloudantExists ? '' : ' not') + ' contain cloudant credentials: \n' + JSON.stringify(bindingsyml));

          assert.ok(cloudantBinding[0].valueFrom, 'Cloudant binding should have a valueFrom element: ' + JSON.stringify(cloudantBinding));
          assert.ok(cloudantBinding[0].valueFrom.secretKeyRef, 'Cloudant valueFrom should have secretKeyRef element: ' + JSON.stringify(cloudantBinding));
        }

        if ( objectStorageExists ) {
          const osBinding = bindingsyml.filter(element => element.name === "service_object_storage");
          assert.equal(osBinding.length > 0, objectStorageExists,
            BINDINGS_YML + ' should' +(objectStorageExists ? '' : ' not') + ' contain object storage credentials: \n' + JSON.stringify(bindingsyml));

          assert.ok(osBinding[0].valueFrom, 'Object Storage binding should have a valueFrom element: ' + JSON.stringify(osBinding));
          assert.ok(osBinding[0].valueFrom.secretKeyRef, 'Object Storage valueFrom should have secretKeyRef element: ' + JSON.stringify(osBinding));
        }

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
