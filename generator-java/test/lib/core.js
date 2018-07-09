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
 * core classes for tests
 */

'use strict';

const constant = require('../../index').testAsserts.constant;
const helpers = require('yeoman-test');
const path = require('path');

process.env.GENERATOR_LOG_LEVEL = 'error';    //turn off most of the logging from enablement generators

class Options {
  constructor(backendPlatform) {
    this.values = {
      version: constant.VERSION,
      groupId: constant.GROUPID,
      artifactId: constant.ARTIFACTID,
      bluemix: {
        backendPlatform: backendPlatform || 'JAVA'
      }
    }
  }

  before() {
    return helpers.run(path.join(__dirname, '../../generators/app'))
      .withOptions(this.values)
      .toPromise();
  }
}

module.exports = {
  Options: Options
};
