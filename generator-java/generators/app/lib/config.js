//configuration module for controlling the template creation.

const PATTERN_NAME = new RegExp("^[a-zA-Z0-9_-]+$");
const PATTERN_ARTIFACT_ID = new RegExp("^[a-zA-Z0-9-_.]*$");

var config = {
  name : "myLibertyProject",
  buildType : "maven",
  artifactId : "artifactId",
  groupId : "groupId"
};    //the configuration object

isValid = function() {
  var value = config.name;
  if(!value || !PATTERN_NAME.test(value) || (value.length > 50)) return false;
  value = config.artifactId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  value = config.groupId;
  if(!value || !PATTERN_ARTIFACT_ID.test(value)) return false;
  return true;
}

module.exports = {
  isValid : isValid,
  data : config
}
