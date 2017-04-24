# Yeoman generator for Java code
This is a [yeoman generator](http://yeoman.io/) that will create Java code for you.

| Build | Status |
| ------ | ---- |
| development | [![Build Status](https://travis.ibm.com/arf/java-codegen-yeoman.svg?token=D9H1S9JmREZirtqjnxut&branch=development)](https://travis.ibm.com/arf/java-codegen-yeoman) |
| master | [![Build Status](https://travis.ibm.com/arf/java-codegen-yeoman.svg?token=D9H1S9JmREZirtqjnxut&branch=master)](https://travis.ibm.com/arf/java-codegen-yeoman) |

The code coverage for the latest version of the generator hosted in the [IBM NPM repository](https://npm.whitewater.ibm.com/package/@arf/generator-java) can be viewed in GitHub Pages. There are separate reports for [unit test coverage](https://pages.github.ibm.com/arf/java-codegen-yeoman/cc/unit/lcov-report/index.html) and [integration test coverage](https://pages.github.ibm.com/arf/java-codegen-yeoman/cc/int/lcov-report/index.html).

# Getting started:

To run the Yeoman generator simply type the following:

```bash
yo @arf/java
```

The generator provides the ability to generate Java applications from Bluemix starters or WebSphere Liberty technologies, for example:

```
? Select from the list of available generation options.
 (Use arrow keys)
❯ Liberty : generate source for WebSphere Liberty.
  Bluemix : generate source for Bluemix starters
```

[Bluemix](https://console.ng.bluemix.net/) starters provide infrastructure files for building locally with Maven or Gradle and deploying to IBM Bluemix using containers. They also include code snippets to connect to any Bluemix services that are selected as part of the generation.

The [WebSphere Liberty](https://developer.ibm.com/wasdev/) technologies option allows a developer to pick and choose which WebSphere Liberty feature they would like in their application and the ability to add Microservice Builder integration to the application.

For more information see our [GitHub Enterprise page](https://github.ibm.com/arf/java-codegen-yeoman).
