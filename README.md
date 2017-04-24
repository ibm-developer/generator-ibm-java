# Yeoman generator for Java code
| Build | Status |
| ------ | ---- |
| development | [![Build Status](https://travis.ibm.com/arf/java-codegen-yeoman.svg?token=D9H1S9JmREZirtqjnxut&branch=development)](https://travis.ibm.com/arf/java-codegen-yeoman) |
| master | [![Build Status](https://travis.ibm.com/arf/java-codegen-yeoman.svg?token=D9H1S9JmREZirtqjnxut&branch=master)](https://travis.ibm.com/arf/java-codegen-yeoman) |

You can see builds for all branches here https://travis.ibm.com/arf/java-codegen-yeoman/branches.

This is a yeoman generator that will create Java code for you.

* It is published as a node module in the IBM NPM repository : https://npm.whitewater.ibm.com
* The node module is published as @arf/generator-java (note that it's [scoped](https://docs.npmjs.com/misc/scope#installing-scoped-packages) to @arf), see the [step above](https://github.ibm.com/Whitewater/npm) as to
why this module is scoped.

The code coverage for the latest version of the generator hosted in the [IBM NPM repository](https://npm.whitewater.ibm.com/package/@arf/generator-java) can be viewed in GitHub Pages. There are separate reports for [unit test coverage](https://pages.github.ibm.com/arf/java-codegen-yeoman/cc/unit/lcov-report/index.html) and [integration test coverage](https://pages.github.ibm.com/arf/java-codegen-yeoman/cc/int/lcov-report/index.html).

## Branches
The generator has a number of branches that correspond to various bluemix environments and development lifecycles

* **development** : this is the development branch, although this should build, it is the latest code for this generator and may not work as expected. This branch is needed to be able to do end-to-end testing as YaaS, scaffolder etc. work from git repositories.
* **master** : this is what is deployed into live.

## Overview
The generator works by taking the answers that the user has supplied, either via the CLI or a UI, and then maps that
to a folder under the templates directory (in future this will be to a Github repository or a cache of a repository).
It then walks all the files in the directory and for each one parses it through a [mustache template processing](https://mustache.github.io/mustache.5.html) engine.

## Building app

### Pre-requisites

* Install [node](https://nodejs.org/en/) from IBM internal site (JIM)
* Add the Whitewater registry to your npm install config: https://github.ibm.com/Whitewater/NPM-Tools-Operation
* Install [Yeoman](http://yeoman.io/learning/index.html) by running ```npm install -g yo```

### Building and running the generator

1. Clone this repository and navigate to *java-codegen-yeoman/generator-java*
2. Run ```npm install``` in *generator-java* to install all of the node modules
3. Run ```npm link``` in *generator-java* to link the local java yeoman generator (see [here](http://yeoman.io/authoring/index.html) for more details
4. Run ```yo @arf/java``` to test the generator

## The internals

### Including / Excluding files
It is possible to include or exclude files from processing by putting a **control.json** file in the root of the template
folder. It is a mustache template (like everything else) and is controlled by the current configuration. In the example
below, if the 'maven' property is present, then the build.gradle file is excluded, with a similar setup of gradle has been chosen.

```
{
  "excludes" : [
    {{#maven}}
    "build.gradle"
    {{/maven}}

    {{#gradle}}
    "pom.xml"
    {{/gradle}}
  ]
}
```

## Running tests
Unit and function tests have been written using [mocha](https://mochajs.org) and to run them, execute the following in the **generators** directory i.e. where the *package.json* file is.

```
npm test
```

## Committing changes

When committing changes to the repository, by using our custom commit template you will allow the Travis build to increase the NPM package version correctly.

1. Create a commitTemplate.txt file with the following contents:
```
feat/fix/perf(<scope>): <subject>

<body>

<footer>

Signed-off-by: Bob <bob@uk.ibm.com>
# The header is mandatory and the scope of the header is optional.
# Revert
# If the commit reverts a previous commit, it should begin with revert:, followed by the header of the reverted commit. In the body it should say: This reverts commit <hash>., where the hash is the SHA of the commit being reverted.
# Type
# If the prefix is feat, fix or perf, it will appear in the changelog. However if there is any BREAKING CHANGE, the commit will always appear in the changelog.
# Other prefixes are up to your discretion. Suggested prefixes are docs, chore, style, refactor, and test for non-changelog related tasks.
# Scope
# The scope could be anything specifying place of the commit change. For example $location, $browser, $compile, $rootScope, ngHref, ngClick, ngView, etc...
# Subject
# The subject contains succinct description of the change:
# use the imperative, present tense: "change" not "changed" nor "changes"
# don't capitalize first letter
# no dot (.) at the end
# Body
# Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.
# Footer
# The footer should contain any information about Breaking Changes and is also the place to reference GitHub issues that this commit Closes.
# Breaking Changes should start with the word BREAKING CHANGE: with a space or two newlines. The rest of the commit message is then used for this.
```
2. Update the commitTemplate.txt file with your name and email address.
3. Use the `git config` command to set the `commit.template` property to the location of your template file.
4. Use the `git config` command to set the `core.editor` property to an editor of your choice. e.g. on Mac `git --add --global core.editor="atom -w"`, on Windows `git --add --global core.editor vi`
5. When creating a commit type `git commit -e` to edit the commit message.
6. Set the Type for the commit based on the [conventional changelog conventions](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md).
7. The Scope of the commit refers to a particular feature

### Features
The current list of features:

* infrastructure
* test

## Build automation

The application is built in Travis whenever a pull request is submitted. The Travis build runs the unit and integration tests and is required to pass before a pull request can be accepted.

When a pull request is merged into the master branch a special script called prerelease.sh is run. This creates code coverage and code scan reports for the code and increases the version in the package.json depending on the commit contents. Travis puts these new files and the version update into a new branch that can be merged into master.

When a pull request is merged into the master branch that includes a version change (the version update should have been created by Travis as above) Travis will automatically publish the new version of the module to the IBM repository.

## Publishing

Publishing of the node module is done automatically by the travis build when a pull request is submitted to the master branch that changes the version specified in package.json. Note: Revving the package version should not be done manually (see #build-automation)

## Updating the master branch

The master branch contains the code for the latest version of the generator hosted in the [IBM NPM repository](https://npm.whitewater.ibm.com/package/@arf/generator-java) and the corresponding files showing code coverage and security. It is not possible to merge a branch into master unless it is up-to-date with the master branch. As a result you **MUST NOT** attempt to merge directly from development to master as this will add the code coverage and security files to the development branch. Instead follow the below process:

Merging from development to master:
* Create a branch from development called devToMaster
* Push the branch and create a pull request into the master branch
* In the pull request click the `update branch` button
* After review merge the devToMaster branch into master

## Yeoman as a Service (YaaS)
One of the ways in which this generator can be invoked.

* Staging YaaS : http://bmd-codegen-yeoman-dev.stage1.ng.bluemix.net/#!/Generator/post_generator

```
{
  "generatorName": "generator-java",
  "scope": "@arf",
  "generatorVersion": "0.1.0",
  "registry": "https://npm-registry.whitewater.ibm.com",
  "generatorOptions": {
    "--headless": true,
    "createType": "basic",
  },
  "bluemix": {
    "server": {
      "memory": "512M"
    }
  }
}
```

Note :- From the YaaS team :- `Currently, when you override the prompt method you will get a promise resolution that will contain the bluemix object. In addition, the generatorOptions is provided through the this.options parameter in your yeoman generator.`

Our generator provides a prompt method (so we can test locally), which means that when running through YaaS we'll get the contents of 'bluemix' as the answers. So in the example above, it's as if the user selected the createType of 'basic' from the prompt.
