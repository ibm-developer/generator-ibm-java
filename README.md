# Yeoman generator for Java code
This is a yeoman generator that will create Java code for you.

* It is published as a node module in the IBM NPM repository : https://npm.whitewater.ibm.com
* To get access to this registry : https://github.ibm.com/Whitewater/npm (explains how to get your login setup)
* The node module is published as @arf/generator-java (note that it's [scoped](https://docs.npmjs.com/misc/scope#installing-scoped-packages) to @arf), see the [step above](https://github.ibm.com/Whitewater/npm) as to
why this module is scoped.

## Overview
The generator works by taking the answers that the user has supplied, either via the CLI or a UI, and then maps that
to a folder under the templates directory (in future this will be to a Github repository or a cache of a repository).
It then walks all the files in the directory and for each one parses it through a [mustache template processing](https://mustache.github.io/mustache.5.html) engine.

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

## Publishing

This needs to be moved to a build pipeline, but at the moment it is a manual publication (obviously after you make sure the tests pass !).

```
npm publish --scope=@arf
```

## Yeoman as a Service (YaaS)
One of the ways in which this generator can be invoked.

* Staging YaaS : http://bmd-codegen-yeoman-dev.stage1.ng.bluemix.net/#!/Generator/post_generator

```
{
  "generatorName": "generator-java",
  "scope": "@arf",
  "generatorVersion": "1.0.2",
  "registry": "https://npm-registry.whitewater.ibm.com",
  "generatorOptions": {
    "--spec": "mySpecValue"
  },
  "bluemix": {
    "server": {
      
    }
  }
}
```
