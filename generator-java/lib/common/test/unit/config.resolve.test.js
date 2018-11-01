/*
 * © Copyright IBM Corp. 2017, 2018
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

//test the conflict resolution of the config module

'use strict';
const assert = require('assert');
const Config = require('../../lib/config');

const data1 = {
  "properties": [
    {"name": "testName", "value": "testValue"}
  ],
  "dependencies": [
    {"groupId": "test.group.id", "artifactId": "testArtifactId", "version": "0.0.2", "scope": "provided"}
  ],
  "frameworkDependencies": [
    {"feature": "testFrameworkDep-1.0"}
  ],
  "envEntries": [
    {"name": "testName", "value": "testValue"}
  ],
  "jndiEntries": [
    {"name": "testName", "value": "testValue"}
  ]
}

const data2 = {
  "properties": [
    {"name": "testOtherName", "value": "testOtherValue"},
    {"name": "testOtherName_2", "value": "testOtherValue"}
  ],
  "dependencies": [
    {"groupId": "test.other.group.id", "artifactId": "testOtherArtifactId", "version": "0.0.2", "scope": "provided"},
    {"groupId": "test.other.group.id", "artifactId": "testOtherArtifactId_2", "version": "1.0.3", "scope": "provided"}
  ],
  "frameworkDependencies": [
    {"feature": "testOtherFrameworkDep-1.0"},
    {"feature": "testOtherFrameworkDep_2-1.0"}
  ],
  "envEntries": [
    {"name": "tesOtherName", "value": "testOtherValue"},
    {"name": "tesOtherName_2", "value": "testOtherValue"}
  ],
  "jndiEntries": [
    {"name": "testOtherName", "value": "testOtherValue"},
    {"name": "testOtherName_2", "value": "testOtherValue"}
  ]
}

const data_conflict = {
  "properties": [
    {"name": "testName", "value": "incompatibleName"}
  ],
  "dependencies": [
    {"groupId": "test.group.id", "artifactId": "testArtifactId", "version": "0.0.1", "scope": "provided"}
  ],
  "frameworkDependencies": [
    {"feature": "testFrameworkDep-2.0"}
  ],
  "envEntries": [
    {"name": "testName", "value": "incompatibleValue"}
  ],
  "jndiEntries": [
    {"name": "testName", "value": "incompatibleValue"}
  ]
}

function execute(type) {
  let name = type.charAt(0).toUpperCase() + type.substr(1);
  it('should be possible to add duplicate ' + type, function () {
    let config = new Config();
    config['add' + name](data1[type]);
    config['add' + name](data1[type]);
    assert.equal(config[type].length, 1);
    assert.equal(config[type][0], data1[type][0]);
  });

  it('should be possible to add different ' + type, function () {
    let config = new Config();
    config['add' + name](data1[type]);
    config['add' + name](data2[type]);
    assert.equal(config[type].length, 3);
    assert.equal(config[type][0], data1[type][0]);
    assert.equal(config[type][1], data2[type][0]);
    assert.equal(config[type][2], data2[type][1]);
  });

  it('should throw an error for conflicting ' + type, function () {
    let config = new Config();
    config['add' + name](data1[type]);
    assert.throws(() => {
      config['add' + name](data_conflict[type])
    }, 'Did not throw an error when attempting to add a conflicting value');
  });
}

describe('Config resolution behaviour', function () {
  execute('dependencies');
  execute('properties');
  execute('envEntries');
  execute('jndiEntries');
});
