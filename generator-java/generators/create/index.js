var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  prompting() {
    return this.prompt([{
      type    : 'list',
      name    : 'createType',
      message : 'Select a project type to create',
      choices : ['Cloudant', 'A second choice'],

    }]).then((answers) => {
      this.log('Create a project for ', answers.createType);
    });
  }

};
