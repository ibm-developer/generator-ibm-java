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

 /* Tests a command successfully executes */

'use strict'

var assert = require('yeoman-assert');

const exec = require('child_process').exec;

function run(command) {
  it('produces a project that can be built with command ' + command, function(done) {
    this.timeout(300000);
    console.log("Running exec with command " + command);
    exec(command, {maxBuffer: 20*1024*1024}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        done(error);
        return;
      }
      assert.equal(error, null);
      done();
    })
  });
}

module.exports = {
  run : run
};
