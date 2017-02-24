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

//module for Handlebars helpers

var Handlebars = require('handlebars');
var javarules = require('./javarules');

//convert a data type to a valid Java one
Handlebars.registerHelper('javaDataType', javarules.dataType);

//convert a name to a valid Java class name
Handlebars.registerHelper('javaClassName', javarules.className);

//convert a name to a valid Java method name
Handlebars.registerHelper('javaMethodName', javarules.methodName);

//lookup and resolve references to data types, will return the Java class name
Handlebars.registerHelper('refLookup', function(ref) {
  var parts = ref.split("/");
  return javarules.className(parts[parts.length - 1]);
});

//lookup and resolve references to data types, will return the Java class name
Handlebars.registerHelper('tag', function(context) {
  return "{{" + context + "}}"
});

//allow slightly more sophisticated inclusion by checking the value of a property, not just it's presence or absence
Handlebars.registerHelper('has', function(context, options, handler) {
  //see if the current context matches the options passed in
  if (context == options) {
    var frame = undefined;
    if (handler.data) {
      //this section allows the contents of the tag to be passed through to the processor
      //but as this is a stack, need to create a new stack frame for this call so that it
      //is popped correctly
      frame = {};
      for (var prop in handler.data) {
        //clone the object as we want to add a _parent property
        if (handler.data.hasOwnProperty(prop)) {
            frame[prop] = handler.data[prop];
        }
      }
      frame._parent = handler.data;
    }
    //call down and process the contents of the block
    return handler.fn(context, {
      data: frame,
      blockParams: [context]
    });
  }
  //parameters didn't match, so don't render anything in the template
  return undefined;
});



module.exports = {
  //module doesn't export anything, all helpers are installed by requiring this module
}
