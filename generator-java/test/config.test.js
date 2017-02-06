//test the config module

var assert = require('assert');
var config = require('../generators/app/lib/config');

var configDefaults = {};

var clone = function(from, to) {
  for (var prop in from) {
    if (from.hasOwnProperty(prop)) {
        to[prop] = new String(from[prop]);
    }
  }
}

before(function() {
  //record default values to restore for each test run
  clone(config.data, configDefaults);
})

beforeEach(function() {
  //make sure we start with a valid config object
  clone(configDefaults, config.data);
});

describe('Config defaults', function() {
  describe('default artifactId', function() {
    it('should be set to "artifactId" when the value has not been set', function(){
      assert.equal('artifactId', config.data.artifactId);
    });
  });
  describe('default grouptId', function() {
    it('should be set to "groupId" when the value has not been set', function(){
      assert.equal('groupId', config.data.groupId);
    });
  });
  describe('default name', function() {
    it('should be set to "myLibertyProject" when the value has not been set', function(){
      assert.equal('myLibertyProject', config.data.name);
    });
  });
  describe('default build', function() {
    it('should be set to "maven" when the build type has not been set', function(){
      assert.equal('maven', config.data.buildType);
    });
  });
});


describe('Config validation', function() {
  describe('Missing name', function() {
    it('should not be valid when the name is either missing or an empty string', function(){
      config.data.name = undefined;
      assert.equal(false, config.isValid());
      config.data.name = '';
      assert.equal(false, config.isValid());
    });
  });
  describe('Invalid name', function() {
    it('should not be valid when the name contains invalid characters', function(){
      config.data.name = "wibble%";
      assert.equal(false, config.isValid());
    });
  });
  describe('Name too long', function() {
    it('should not be valid when the name contains too many characters', function(){
      config.data.name = "ThisIsAReallyLongNameButIsItLongEnoughNotQuiteSoLetsKeepGoing";
      assert.equal(false, config.isValid());
    });
  });
  describe('Invalid artifactId', function() {
    it('should not be valid when the artifactId contains invalid characters', function(){
      config.data.artifactId = "%wibble";
      assert.equal(false, config.isValid());
    });
  });
  describe('Invalid groupId', function() {
    it('should not be valid when the groupId contains invalid characters', function(){
      config.data.groupId = "%wibble";
      assert.equal(false, config.isValid());
    });
  });
});
