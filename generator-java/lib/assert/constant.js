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

'use strict';

module.exports = exports = {
    APPNAME: 'testApp',
    ARTIFACTID: 'artifact.0.1',
    BX_CLOUDANT: [{"serviceInfo": {"name": "test-cloudantNoSQLDB-000","label": "cloudantNoSQLDB","plan": "Lite"},
    "password" : "pass", "url" : "https://account.cloudant.com", "username" : "user"}],
    BX_OBJECT_STORAGE: [{"serviceInfo": {"name": "test-Object-Storage-000","label": "Object-Storage","plan": "standard"},
    "project": "objectStorage-project", "userId": "objectStorage-userId", "password": "objectStorage-password",
    "auth_url": "objectStorage-url","domainName": "objectStorage-domainName"}],
    BX_SERVER: {"host": "host", "domain": "mybluemix.net"},
    CLI_CONFIG_YML: 'cli-config.yml',
    CLI_VERSION: '0.0.2',
    COMPILE: process.env.COMPILE === 'false' ? false : true,
    FRAMEWORK_LIBERTY: 'liberty',
    FRAMEWORK_SPRING: 'spring',
    GROUPID: 'test.group',
    TOOLCHAIN_YML: '.bluemix/toolchain.yml',
    LOCALDEV_FILE: 'src/main/resources/localdev-config.json',
    VERSION: '1.0.0'
};
