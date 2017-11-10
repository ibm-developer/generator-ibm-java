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

module.exports = {
    endToEndAsserts: {
        builds: require('./generators/lib/test/endToEnd/assert.builds')
    },
    integrationAsserts: {
        basicweb: require('./generators/lib/test/integration/assert.basicweb'),
        bff: require('./generators/lib/test/integration/assert.bff'),
        blank: require('./generators/lib/test/integration/assert.blank'),
        enable: require('./generators/lib/test/integration/assert.enable'),
        microservice: require('./generators/lib/test/integration/assert.microservice'),
        openapi: require('./generators/lib/test/integration/assert.openapi'),
        technologies: require('./generators/lib/test/integration/assert.technologies'),
        testbluemix: require('./generators/lib/test/test-bluemix')
    }
};
