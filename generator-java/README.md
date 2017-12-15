# Yeoman generator for Java code
This is a [yeoman generator](http://yeoman.io/) that will create Java code for you.


[![IBM Cloud powered][img-bluemix-powered]][url-bluemix]
[![Travis][img-travis]][url-travis]
[![Coveralls][img-coveralls-master]][url-coveralls-master]
[![Codacy][img-codacy]][url-codacy]
[![Version][img-version]][url-npm]
[![DownloadsMonthly][img-npm-downloads-monthly]][url-npm]
[![DownloadsTotal][img-npm-downloads-total]][url-npm]
[![License][img-license]][url-npm]
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

[img-bluemix-powered]: https://img.shields.io/badge/bluemix-powered-blue.svg
[url-bluemix]: http://bluemix.net

[img-travis]: https://travis-ci.org/ibm-developer/generator-ibm-java.svg?branch=master
[url-travis]: https://travis-ci.org/ibm-developer/generator-ibm-java

[img-coveralls-master]: https://coveralls.io/repos/github/ibm-developer/generator-ibm-java/badge.svg
[url-coveralls-master]: https://coveralls.io/github/ibm-developer/generator-ibm-java

[img-codacy]: https://api.codacy.com/project/badge/Grade/a5893a4622094dc8920c8a372a8d3588?branch=development
[url-codacy]: https://www.codacy.com/app/ibm-developer/generator-ibm-java

[img-version]: https://img.shields.io/npm/v/generator-ibm-java.svg
[url-npm]: https://www.npmjs.com/package/generator-ibm-java
at  atat  
[img-npm-downloads-monthly]: https://img.shields.io/npm/dm/generator-ibm-java.svg

[img-npm-downloads-total]: https://img.shields.io/npm/dt/generator-ibm-java.svg

[img-license]: https://img.shields.io/npm/l/generator-ibm-java.svg

# Getting started:

To run the Yeoman generator simply type the following:

```bash
yo @arf/java
```

The generator provides the ability to generate Java applications from IBM Cloud starters or WebSphere Liberty technologies, for example:

```
? Select from the list of available generation options.
 (Use arrow keys)
❯ Liberty : generate source for WebSphere Liberty.
  IBM Cloud : generate source for IBM Cloud starters
```

[IBM Cloud](https://console.ng.bluemix.net/) starters provide infrastructure files for building locally with Maven or Gradle and deploying to IBM Cloud using containers. They also include code snippets to connect to any IBM Cloud services that are selected as part of the generation.

The [WebSphere Liberty](https://developer.ibm.com/wasdev/) technologies option allows a developer to pick and choose which WebSphere Liberty feature they would like in their application and the ability to add Microservice Builder integration to the application.

For more information see [https://github.com/ibm-developer/generator-ibm-java](https://github.com/ibm-developer/generator-ibm-java).
