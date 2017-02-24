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

//test the log module

var assert = require('assert');
var logger = require('../../generators/lib/log');

describe('logging module', function() {

  describe('manage log entries', function() {
    it('it should clear the log', function(){
      logger.clear()
      logger.writeToLog("Test", "Test");
      logger.clear();
      assert.equal(0, logger.getLogs().length);
    });
  });

  describe('can log different data types', function() {
    it('it should log a String as is', function(){
      logger.clear();
      logger.writeToLog("Test", "This is a string");
      assert.equal("Test : This is a string", logger.getLogs()[0]);
    });
    it('it should log an objects properties and method names', function(){
      logger.clear();
      logger.writeToLog("Test", {name : 'TestName', method : function(){}});
      var data = logger.getLogs()[0];
      assert(data.indexOf('TestName') != -1);
      assert(data.indexOf('method') != -1);
    });
    it('it should log missing data as undefined', function(){
      logger.clear();
      logger.writeToLog("Test");
      var data = logger.getLogs()[0];
      assert(data.indexOf('undefined') != -1);
    });
  });

});
