# Yeoman generator for Java code
| Build | Status |
| ------ | ---- |
| development | [![Build Status](https://travis.ibm.com/arf/java-codegen-yeoman.svg?token=D9H1S9JmREZirtqjnxut&branch=development)](https://travis.ibm.com/arf/java-codegen-yeoman) |
| master | [![Build Status](https://travis.ibm.com/arf/java-codegen-yeoman.svg?token=D9H1S9JmREZirtqjnxut&branch=master)](https://travis.ibm.com/arf/java-codegen-yeoman) |

You can see builds for all branches here https://travis.ibm.com/arf/java-codegen-yeoman/branches.

This is a yeoman generator that will create Java code for you.

* It is published as a node module in the IBM NPM repository : https://npm.whitewater.ibm.com
* The node module is published as @arf/generator-java (note that it's [scoped](https://docs.npmjs.com/misc/scope#installing-scoped-packages) to @arf).

The code coverage for the latest version of the generator hosted in the [IBM NPM repository](https://npm.whitewater.ibm.com/package/@arf/generator-java) can be viewed in GitHub Pages. There are separate reports for [unit test coverage](https://pages.github.ibm.com/arf/java-codegen-yeoman/cc/unit/lcov-report/index.html) and [integration test coverage](https://pages.github.ibm.com/arf/java-codegen-yeoman/cc/int/lcov-report/index.html).

## Branches
The generator has a number of branches that correspond to various IBM Cloud environments and development lifecycles

* **development** : this is the development branch, although this should build, it is the latest code for this generator and may not work as expected. Code changes must be delivered to this branch first.
* **master** : this is what is deployed into live.

## Overview
The generator works by taking the answers that the user has supplied, either via the CLI or a UI, and then maps that to a folder under the templates directory. All files are processed using [Handlebars](http://handlebarsjs.com/) to insert the configuration specified by the user.

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

## Contributing

For details about contributing see the [contribution documentation](https://pages.github.ibm.com/arf/java-codegen-devguide/release/contributing/).

## More details

For more detailed documentation see the [Java generator docs](https://pages.github.ibm.com/arf/java-codegen-devguide/java/intro/).
