/*
These sets of tests test if we have generated all the bluemix files.
*/

'use strict'

var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
const tests = require('@arf/common-codegen-tests');

function test_bluemix_ng(platform) {
  this.generate = generate;
}

test_bluemix_ng.configure = function(appName, generatorLocation, options) {
  this.options = options;
  this.generatorLocation = generatorLocation;
  this.before = function() {
    const ymock = new tests.YMock(appName, platform, options);
    return helpers.run(generatorLocation)
                  .withOptions(ymock.getOptions())
                  .toPromise();
  };
}

test_bluemix_ng.test = function(exists) {
  describe('Validate bluemix files for an application', function() {

    if(this.before) {
      before(this.before);
    }

    var prefix = exists ? 'generates ' : 'does not generate ';
    var check = exists ? assert.file : assert.noFile;

    it(prefix + 'bluemix file manifest.yml', function() {
      check('manifest.yml');
    });

    it(prefix + 'bluemix file pipeline.yml', function() {
      check('.bluemix/pipeline.yml');
    });

    it(prefix + 'bluemix file toolchain.yml', function() {
      check('.bluemix/toolchain.yml');
    });

    it(prefix + 'bluemix file deploy.json', function() {
      check('.bluemix/deploy.json');
    });
  });
}


module.exports = test_bluemix_ng;
