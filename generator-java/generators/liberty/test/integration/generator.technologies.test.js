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

/**
 * Tests the technology aspect of the generator
 */
'use strict';
const path = require('path');
const helpers = require('yeoman-test');
const AssertTech = require('../../lib/assert.technologies');
const common = require('../../../../lib/common');
const command = common.test('command');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';

class Options extends AssertTech {

  constructor(createType, technologies, buildType) {
    super();
    this.conf = {
      buildType : buildType,
      createType : createType,
      technologies : technologies,
      appName : APPNAME,
      groupId : GROUPID,
      artifactId : ARTIFACTID,
      version : VERSION
    }
    const ctx = new common.context('test', this.conf);
    this.options = {
      context : ctx
    };
    this.before = function() {
      return helpers.run(path.join( __dirname, '../../generators/app'))
        .withOptions(this.options)
        .toPromise();
    }
    this.assertCompiles = function() {
      command.run(common.test(buildType).getCompileCommand());
    }
  }

}

const technologies = ['rest', 'microprofile', 'persistence', 'websocket', 'web', 'watsonsdk', 'swagger', 'springbootweb', 'msbuilder'];
const buildTypes = ['gradle', 'maven'];

execute('picnmix', 'picnmix', technologies);

function execute(createType, assertFunc, technologiesToTest) {

  describe('java liberty generator : technologies integration test', function () {

    for(let i = 0; i < technologiesToTest.length; i++) {
      for(let j = 0; j < buildTypes.length; j++) {
        describe('Generates a ' + createType + ' project for ' + technologiesToTest[i] + ' (' + buildTypes[j] + ')', function () {
          const options = new Options(createType, [technologiesToTest[i]], buildTypes[j]);
          before(options.before.bind(options));
          options['assert' + assertFunc](APPNAME);
          options['assert' + technologiesToTest[i]](buildTypes[j]);
          if(technologiesToTest[i] === 'springbootweb' && createType === 'picnmix') {
            options.assertspringbootwebonly(buildTypes[j]);
          }
          options.assertCompiles();
        });
      }
    }
  });
}

describe('java liberty generator : technologies integration test', function () {

  describe('Generates a project for (no technologies)', function () {
    const options = new Options('picnmix', [], 'maven');
    before(options.before.bind(options));
    options.assert(APPNAME);
  });

});

const totalTechnologies = Math.floor(Math.random() * technologies.length) + 1;  //how many technologies to pick - min of 1 up to number of available technologies

for(let i = 0; i < 5; i++) {
  const techsToPickFrom = Array.from(technologies);                        //copy of technologies to pick from
  const techs = new Array();                                           //chosen technologies
  let description = new String();

  for(let j = 0; j < totalTechnologies; ) {
    const index = Math.floor(Math.random() * technologies.length);
    const tech = techsToPickFrom[index];
    if(tech) {
      techs.push(technologies[index]);
      techsToPickFrom[index] = undefined;
      description += tech + ' ';
      j++;
    }
  }
  executeMultiTechTest(description, techs);
}

function executeMultiTechTest(description, techs) {
  describe('java liberty generator : ' + totalTechnologies + ' random technologies integration test', function () {

    describe('Generates a project for [' + description.trim() + ']', function () {
      const options = new Options('picnmix', techs, 'maven');
      before(options.before.bind(options));
      options.assertpicnmix(APPNAME);
      for(let k = 0; k < techs.length; k++) {
        options['assert' + techs[k]]('maven');
      }
    });

  });
}
