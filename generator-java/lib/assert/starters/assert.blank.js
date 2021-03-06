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

'use strict'

const Assert = require('../internal/assert.core')
const constant = require('../constant')
const assert = require('yeoman-assert')

class AssertBlank extends Assert {
  assert (appName, buildType, frameworkType) {
    super.assert(appName, buildType, frameworkType)
    if (frameworkType === constant.FRAMEWORK_SPRING) {
      it('creates an SBApplication.java file', function () {
        assert.file('src/main/java/application/SBApplication.java')
      })
    }
    it('creates an README.mdfile', function () {
      assert.file('README.md')
    })
  }
}

module.exports = exports = AssertBlank
