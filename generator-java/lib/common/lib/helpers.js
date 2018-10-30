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

//module for Handlebars helpers

'use strict';
const Handlebars = require('handlebars');

//allow slightly more sophisticated inclusion by checking the value of a property, not just it's presence or absence
Handlebars.registerHelper('has', function(context, options, handler) {
  let found = Array.isArray(context) ? context.includes(options) : (context === options);
  //see if the current context matches the options passed in
  if (found) {
    let data = Handlebars.createFrame(handler.data);
    return handler.fn(handler.data.root, {data : data, blockParams : [handler.data.root]});
  }
  //parameters didn't match, so don't render anything in the template
  return undefined;
});

//allow slightly more sophisticated exclusion by checking the value of a property, not just it's presence or absence
Handlebars.registerHelper('missing', function(context, options, handler) {
  let missing = Array.isArray(context) ? !context.includes(options) : (context != options);
  //see if the current context matches the options passed in
  if (missing) {
    let data = Handlebars.createFrame(handler.data);
    //pass back contents as is for processing, rather than the data that is passed as the context
    return handler.fn(handler.data.root, {data : data, blockParams : [handler.data.root]});
  }
  //parameters matched, so don't render anything in the template
  return undefined;
});

//convert tag contents to lower case
Handlebars.registerHelper('toLowerCase', function(context) {
  return String(context).toLowerCase();
});

//convert tag contents to upper case
Handlebars.registerHelper('toUpperCase', function(context) {
  return String(context).toUpperCase();
});

Handlebars.registerHelper('firstAvailable', function() {
  for(let i=0; i < arguments.length; i++) {
    if (arguments[i] && typeof arguments[i] === 'string') {
      return arguments[i];
    }
  }
  return "undefined";
});

//allow access to String object functions
Handlebars.registerHelper('string', function() {
  let argsToPass = [];                //arguments to pass to the string function
  let s = String(arguments[1]);       //create a new string object, save the reference a needed for the 'this' parameter in the apply call
  let name = arguments[0];
  let notInverted = true;
  if(name.charAt(0) == '!') {
    notInverted = false;
    name = name.substr(1);
  }
  let f = s[name];            //the method on the string object that is going to be invoked
  let handler = arguments[arguments.length - 1];    //the handlebars context handler is always the last argument
  if(arguments.length > 3) {
    //pass through all arguments through, not including the method name and string as well as stripping off the last argument which is added by handlebars
    for(let i = 2; i < arguments.length - 1; argsToPass.push(arguments[i++]));
  } 
  let result = f.apply(s, argsToPass);
  if(typeof result === 'string') {
    return result;    //the function manipulated the original string in some way so return this as the result e.g. toLowerCase()
  }
  if(!(result ^ notInverted)) {        //for all other 'trythy' results process the contents of the tag
    let data = Handlebars.createFrame(handler.data);
    return handler.fn(handler.data.root, {data : data, blockParams : [handler.data.root]});
  }
  return undefined;
});

module.exports = {
  handlebars : Handlebars
}
