var Generator = require('yeoman-generator');
var Mustache = require('mustache');
var config = require("./lib/config");
var processor = require("./lib/fsprocessor.js");
var fspath = require('path');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    //create command line options that will be passed by YaaS
    this.option('maven');
    this.option('gradle');
  }

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
    var log = this.log;   //used in callbacks
    log("NEED TO BLOCK FOR ASYNC OPERATIONS");
    log("Templates are at " + this.templatePath('cnds-java-starter-rest'));
    var projectPath = fspath.resolve(this.destinationRoot(), "projects/rest");
    this.destinationRoot(projectPath);
    this.log("Destination path : " + this.destinationRoot());
    processor.path = this.templatePath('cnds-java-starter-rest');
    console.log(JSON.stringify(processor));
    return processor.scan((relativePath, template) => {
      var outFile = this.destinationPath(relativePath);
      console.log("CB : writing to " + outFile);
      var json = {
        artifactId : "ARTIFACT_ID"
      }
      var output = Mustache.render(template, json);
      this.fs.write(outFile, output);
    });
    /*
    this.log("Generating project files for -+- " + config.data.name + " ...");
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
    */
  }

};
