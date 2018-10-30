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

//module for storing default configuration values for yeoman options
// e.g. {appName : {desc : 'Name of the application', type : String, default : 'LibertyProject'}}
'use strict';
class Defaults {
  constructor(defaultValues) {
    this.defaultValues = defaultValues;
  }

  getObject(name) {
    return this.defaultValues[name];
  }

  get(name) {
    if (name === undefined) {
      return Object.keys(this.defaultValues);
    } else {
      return this.defaultValues[name].default;
    }
  }

  setOptions(generator) {
    let defaults = this.get();
    for (let i = 0; i < defaults.length; i++) {
      let key = defaults[i];
      generator.option(key, this.getObject(key));
    }
  }
}

module.exports = exports = Defaults;
