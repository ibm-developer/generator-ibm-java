/*
 * Copyright IBM Corporation 2017
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

//helpers only used by the main generator and so are not shared
const common = require('@arf/java-common');
const Handlebars = common.helpers.handlebars;   //this will add the helpers to the main handlebars

//lookup and resolve references to data types, will return the Java class name
Handlebars.registerHelper('refLookup', function(ref) {
  var parts = ref.split("/");
  return javarules.className(parts[parts.length - 1]);
});

//lookup and resolve references to data types, will return the Java class name
Handlebars.registerHelper('tag', function(context) {
  return "{{" + context + "}}";
});

module.exports = {
  handlebars : Handlebars
}
