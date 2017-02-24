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

//module for logging capabilities, shared across the generator

var log = [];

var writeToLog = function(header, data) {
  if(!data) {
    log.push(header + " : undefined");
    return;
  }
  if((typeof data === 'string') || (typeof data === 'number') || (typeof data === 'boolean')) {
    log.push(header + " : " + data);
  } else {
    log.push(header + " : " + JSON.stringify(data, null, 2) + JSON.stringify(Object.getOwnPropertyNames(data), null, 2));
  }
}

var getLogs = function() {
  return log;
}

//clear any log entries
var clear = function() {
  log = [];
}

module.exports = {
  //module doesn't export anything, all helpers are installed by requiring this module
  writeToLog : writeToLog,
  getLogs : getLogs,
  clear : clear
}
