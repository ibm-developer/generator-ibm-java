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


//exports so that the common libraries can be accessed

'use strict';

function test(build) {
  const test_build = require('./lib/test-' + build);
  return new test_build();
}

module.exports = {
  config : require('./lib/config'),
  context : require('./lib/context'),
  control : require('./lib/control'),
  fsprocessor : require('./lib/fsprocessor'),
  handlebars : require('./lib/helpers').handlebars,
  javarules : require('./lib/javarules'),
  log : require('./lib/log'),
  defaults : require('./lib/defaults'),
  test : test
};
