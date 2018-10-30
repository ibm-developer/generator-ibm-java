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
 * Provides the assertions for testing Liberty code and config from this generator
 */

'use strict'

const assert = require('yeoman-assert')
const example = require('../resources/openapi/basicswagger.json')
const example1 = require('../resources/openapi/basicswagger1.json')

function AssertOpenApi () {
  this.assert = function (exists, examples) {
    const check = exists ? assert.file : assert.noFile
    const desc = exists ? 'creates openapi files' : 'does not create openapi files'
    if (examples.includes('example')) {
      it(desc, function () {
        check(['src/main/java/io/swagger/model/CollectiveInfo.java', 'src/main/java/io/swagger/api/IbmApi.java'])
        assert.noFile('src/main/java/io/swagger/api/RestApplication.java')
      })
    }
    if (examples.includes('example1')) {
      it(desc, function () {
        check(['src/main/java/io/swagger/model/Pet1.java', 'src/main/java/io/swagger/api/Pets1Api.java'])
        assert.noFile('src/main/java/io/swagger/api/RestApplication.java')
      })
    }
  }

  this.getExample = function () {
    return {name: 'example', value: example}
  }
  this.getExample1 = function () {
    return {name: 'example1', value: example1}
  }
}

module.exports = exports = AssertOpenApi
