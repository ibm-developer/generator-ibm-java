/*
These sets of tests test if we have generated all the bluemix files.
*/

'use strict'

const helpers = require('yeoman-test')
const assert = require('yeoman-assert')
const tests = require('common-codegen-tests')

function test_bluemix_ng () {
  // this.generate = generate
}

test_bluemix_ng.configure = function (appName, generatorLocation, options) {
  this.options = options
  this.generatorLocation = generatorLocation
  this.before = function () {
    const ymock = new tests.YMock(appName, options)
    return helpers.run(generatorLocation)
      .withOptions(ymock.getOptions())
      .toPromise()
  }
}

test_bluemix_ng.test = function (exists) {
  describe('Validate bluemix files for an application', function () {

    if (this.before) {
      before(this.before)
    }

    const prefix = exists ? 'generates ' : 'does not generate '
    const check = exists ? assert.file : assert.noFile

    it(prefix + 'bluemix file manifest.yml', function () {
      check('manifest.yml')
    })

    it(prefix + 'bluemix file pipeline.yml', function () {
      check('.bluemix/pipeline.yml')
    })

    it(prefix + 'bluemix file toolchain.yml', function () {
      check('.bluemix/toolchain.yml')
    })

    it(prefix + 'bluemix file deploy.json', function () {
      check('.bluemix/deploy.json')
    })
  })
}

module.exports = test_bluemix_ng
