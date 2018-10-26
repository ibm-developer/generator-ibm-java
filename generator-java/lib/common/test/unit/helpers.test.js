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

//test the Handlebars helper

'use strict';
const assert = require('assert');
const Handlebars = require('handlebars');
const fs = require('../../lib/fsprocessor');

let helpersTestData = {
  value : "camelCaseName",
  item : "green",
  array : ["yellow", "pink"],
  noValue : undefined
}

let helpersTestResult = undefined;

before(function() {
  //before we start, process the template
  let template = fs.getContentsSync("./test/resources/helpers/unit.template")
  let compiledTemplate = Handlebars.compile(template);
  helpersTestResult = compiledTemplate(helpersTestData);
  //console.log(helpersTestResult);
});

describe('Test custom Handlebars functions work as expected', function() {
  it('should be convert tag values to lowercase', function(){
    assert(helpersTestResult.includes("LowerCase : [camelcasename]"));
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
  it('should be not process when array has no "blue"', function(){
    assert(helpersTestResult.includes("has : [colour:]"));
  });
  it('should be process when array has "yellow"', function(){
    assert(helpersTestResult.includes("has : [yellow]"));
  });
  it('should be not process when the item is "green"', function(){
    assert(helpersTestResult.includes("missing : []"));
  });
  it('should be process when the item is "red"', function(){
    assert(helpersTestResult.includes("missing : [red]"));
  });
  it('should be not process when array has "yellow"', function(){
    assert(helpersTestResult.includes("missing : [colour:]"));
  });
  it('should be process when array has no "blue"', function(){
    assert(helpersTestResult.includes("missing : [blue]"));
  });
  it('should select first non-null from list', function(){
    assert(helpersTestResult.includes("firstAvailable : [camelCaseName]"));
  });
  it('should select default string from list', function(){
    assert(helpersTestResult.includes("firstAvailableDefault : [valueString]"));
  });
  it('should return undefined when no non-null value', function(){
    assert(helpersTestResult.includes("firstAvailableFallback : [undefined]"));
  });
  it('should return tag contents for matching String.includes() function', function(){
    assert(helpersTestResult.includes("string : [includes pass]"));
  });
  it('should return tag contents for matching !String.includes() function', function(){
    assert(helpersTestResult.includes("string : [inverted pass]"));
  });
  it('should not return tag contents for non-matching String.includes() function', function(){
    assert(!helpersTestResult.includes("string : [includes fail]"));
  });
  it('should return correct object value String.toLowerCase() function', function(){
    assert(helpersTestResult.includes("string : [camelcasename]"));
  });
});
