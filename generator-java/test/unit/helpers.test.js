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

//test the Handlebars helper

var assert = require('assert');
var Handlebars = require('handlebars');
var helpers = require('../../generators/lib/helpers');
var fs = require('../../generators/lib/fsprocessor');

var helpersTestData = {
  value : "camelCaseName",
  item : "green"
}

var helpersTestResult = undefined;

before(function() {
  //before we start, process the template
  var template = fs.getContentsSync("./test/resources/helpers/unit.template")
  var compiledTemplate = Handlebars.compile(template);
  helpersTestResult = compiledTemplate(helpersTestData);
});

describe('Test custom Handlebars functions work as expected', function() {
  it('should be convert tag values to lowercase', function(){
    assert(helpersTestResult.includes("LowerCase : [camelcasename]"));
  });
  it('should be convert tag values to uppercase', function(){
    assert(helpersTestResult.includes("UpperCase : [CAMELCASENAME]"));
  });
  it('should be convert tag values to uppercase', function(){
    assert(helpersTestResult.includes("UpperCase : [CAMELCASENAME]"));
  });
  it('should be not process when the item is "red"', function(){
    assert(helpersTestResult.includes("has : []"));
  });
  it('should be process when the item is "green"', function(){
    assert(helpersTestResult.includes("has : [green]"));
  });

});
