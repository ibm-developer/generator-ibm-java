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

//test the log module

'use strict';
const assert = require('assert');
const logger = require('../../lib/log');

describe('logging module', function() {

  describe('can log different data types', function() {
    let log = [];
    let loggerFn = function(data) {
      log.push(data)
    }
    logger.setLogger(loggerFn)
    it('it should log a String as is', function(){
      log = [];
      logger.writeToLog("Test", "This is a string");
      assert.equal("Test : This is a string", log[0]);
    });
    it('it should log an objects properties and method names', function(){
      log = [];
      logger.writeToLog("Test", {name : 'TestName', method : function(){}});
      const data = log[0];
      assert(data.indexOf('TestName') != -1);
      assert(data.indexOf('method') != -1);
    });
    it('it should log missing data as undefined', function(){
      log = [];
      logger.writeToLog("Test");
      const data = log[0];
      assert(data.indexOf('undefined') != -1);
    });
  });

});
