var Generator = require('yeoman-generator');
var Mustache = require('mustache');

module.exports = class extends Generator {

  prompting() {
    return this.prompt([{
      type    : 'list',
      name    : 'createType',
      message : 'Select a project type to create',
      choices : ['Sample : a basic test sample used to test this generator', 'Basic : a basic Java microservice (TBD)'],
      default : 0 // Default to current folder name
    }]).then((answers) => {

      this.log('Create a project for ', answers.createType);
    });
  }

  writing() {
    this.log("Generating project files ...");
    this.log("Destination path : " + this.destinationRoot());
    var data = {
      artifactId : "ARTIFACT_ID"
    }

    this.log("Reading template ...");
    var template = this.fs.read(this.templatePath('cnds-java-starter-rest/pom.xml'));
    this.log("Processing template ...");
    var output = Mustache.render(template, data);
    this.log("Writing template ...");
    this.fs.write(this.destinationPath('projects/rest/pom.xml'), output);
  }

};
