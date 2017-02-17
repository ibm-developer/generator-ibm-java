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

//module to provide rules for generating java artifacts

function convertToJavaName(name, isClass) {
  if(!name.length) return "anonymous";
  name = name.trim();
  var result = "";
  for(var i = 0; i < name.length; i++) {
    var c = name.charAt(i);
    if(i == 0) {
      if(isClass) {
        c = c.toUpperCase();
      } else {
        c = c.toLowerCase();
      }
    }
    switch(c) {
      case ' ' :
        result += "_";
        break;
      default:
        result += c;
        break;
    }
  }
  return result;
}

var methodName = function(name) {
  return convertToJavaName(name, false);
}

var className = function(name) {
  return convertToJavaName(name, true);
}

var dataType = function(type) {
  if(type === "string") return "String";
  if(type === 'integer') return "long";
  return "Object";
}

module.exports = {
  methodName : methodName,
  className : className,
  dataType : dataType
};
