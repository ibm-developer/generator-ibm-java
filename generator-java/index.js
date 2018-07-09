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

module.exports = {
  testAsserts: {
    starters: {
      basicweb: require('./lib/assert/starters/assert.basicweb'),
      bff: require('./lib/assert/starters/assert.bff'),
      blank: require('./lib/assert/starters/assert.blank'),
      enable: require('./lib/assert/starters/assert.enable'),
      microservice: require('./lib/assert/starters/assert.microservice'),
      openapi: require('./lib/assert/starters/assert.openapi'),
      skit: require('./lib/assert/starters/assert.skit'),
      technologies: require('./lib/assert/starters/assert.technologies')
    },
    bluemix: require('./lib/assert/assert.bluemix'),
    builds: require('./lib/assert/assert.builds'),
    framework: require('./lib/assert/assert.framework'),
    constant: require('./lib/assert/constant.js')
  },
  defaults: require('./generators/lib/defaults'),
  prompts: [require('./generators/prompts/patterns'), require('./generators/prompts/bluemix')]
}
