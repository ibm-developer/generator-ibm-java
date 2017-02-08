//test the controller

var assert = require('assert');
var control = require('../generators/app/lib/control');
var path = require('path');
var config = require("../generators/app/lib/config");

describe('control library', function() {

  describe('can find a control file', function() {
    it('it should find the control.json file in the root', function(){
      config.data.templateFullPath = path.resolve("./test/resources/test-with-control");
      control.processProject(config);
      assert.equal(true, control.hasControl());
    });
  });

  describe('ignores control files in sub folder', function() {
    it('it should ignore any control.json file not found in the root', function(){
      config.data.templateFullPath = path.resolve("./test/resources/test-without-control");
      control.processProject(config);
      assert.equal(false, control.hasControl());
    });
  });
});
