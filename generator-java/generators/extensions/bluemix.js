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

var logger = require("../lib/log");

const EXT_ID = 'ext:bluemix';

function Extension() {
  this.id = EXT_ID;
}

Extension.prototype.getChoice = function() {
  return {
    name : 'Bluemix : generate source for Bluemix starters',
    value : EXT_ID,
    short : 'Bluemix source generation'
  };
}

Extension.prototype.show = function(answers) {
  return answers && (answers.extName === EXT_ID);
}

Extension.prototype.getQuestions = function() {
  return [{
    when    : this.show,
    type    : 'list',
    name    : 'createType',
    message : 'This is a test front end for manually driving the Java code generator.\n',
    choices : [{
      name : 'Basic : a basic Java microservice',
      value : 'basic',
      short : 'Basic Java microservice'
    }, {
      name : 'Microservice : a basic Java microservice',
      value : 'microservice',
      short : 'Basic Java microservice'
    }, {
      name : 'Basic Web : a basic web application',
      value : 'basicweb',
      short : 'Basic web application'
    }, {
      name : 'BFF : Backend For Frontend (generate java from Swagger/OpenAPI)',
      value : 'bff',
      short : 'Backend For Frontend'
    }],
    default : 0 // Default to rest sample
  }, {
    when    : this.show,
    type    : 'checkbox',
    name    : 'services',
    message : 'Select the services for your project.\n',
    choices : ['none','cloudant', 'objectStorage'],
    default : 0 // Default to none
  }, {
    when    : this.show,
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
  config.bluemix = answers.bluemix || config.bluemix;
  if(config.bluemix) {
    config.appName = config.bluemix.name || answers.appName || config.appName;
  }
  //below this point, the only way to get these answers is to run the generator locally
  if(answers.services) {
    if(!config.bluemix) {
      config.bluemix = {};
    }
    logger.writeToLog("Processing interactive answers", answers.services);
    config.bluemix.server = {
      name : "testBxName",
      host : "host",
      domain : "domain"
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
