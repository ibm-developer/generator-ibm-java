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

'use strict'

var logger = require('@arf/java-common').log;

const PROMPT_ID = 'prompt:bluemix';

function Extension(config) {
  this.id = PROMPT_ID;
  this.config = config;
}

Extension.prototype.getChoice = function() {
  return undefined;
}

Extension.prototype.show = function(answers) {
  var result = false;
  if (answers) {
    if(answers.promptType) {
      result = (answers.promptType === 'prompt:patterns')||(answers.addbluemix);
    } else {
      result = (this.config.promptType === 'prompt:patterns')||(answers.addbluemix);
    }
  }  else {
    result = (this.config.promptType === 'prompt:patterns');
  }
  return result;
}

Extension.prototype.getQuestions = function() {
  return [{
    when    : this.show.bind(this),
    type    : 'checkbox',
    name    : 'services',
    message : 'Select the services for your project.\n',
    choices : ['none','cloudant', 'objectStorage'],
    default : 0 // Default to none
  }, {
    when    : this.show.bind(this),
    type    : 'input',
    name    : 'bluemix',
    message : 'Enter the bluemix JSON',
    default : "{}"
  }];
}

Extension.prototype.afterPrompt = function(answers, config) {
  //answers.bluemix is a JSON string and needs to be converted
  if (typeof (answers.bluemix) === 'string') {
    answers.bluemix = JSON.parse(answers.bluemix);
  }
  config.overwrite(answers);
  //below this point, the only way to get these answers is to run the generator locally
  if(answers.services) {
    if(!config.bluemix) {
      config.bluemix = {};
    }
    logger.writeToLog("Processing interactive answers", answers.services);
    config.bluemix.server = {
      name : answers.appName || config.appName || "testBxName",
      host : "host",
      domain : "mybluemix.net"
    }
    config.bluemix.server.services = answers.services;
    for(var i = 0; i < answers.services.length; i++) {
      var service = answers.services[i];
      if(service === "none") {
        config.bluemix = undefined;
        break;    //stop processing if none has been selected
      }
      if(service === "cloudant") {
        if(!config.bluemix.cloudant) {
          config.bluemix.cloudant = [
            {
              "serviceInfo": {
                "name": "test-cloudantNoSQLDB-000",
                "label": "cloudantNoSQLDB",
                "plan": "Lite"
              },
              "password": "pass",
              "url": "https://account.cloudant.com",
              "username": "user"
            }
          ];
        }
      }
      if(service === "objectStorage") {
        if(!config.bluemix.objectStorage) {
          config.bluemix.objectStorage = [
            {
              "serviceInfo": {
                "name": "test-Object-Storage-000",
                "label": "Object-Storage",
                "plan": "standard"
              },
              "project": "objectStorage-project",
              "userId": "objectStorage-userId",
              "password": "objectStorage-password",
              "auth_url": "objectStorage-url",
              "domainName": "objectStorage-domainName"
            }
          ];
        }
      }
    }
  }
}

module.exports = exports = Extension;
