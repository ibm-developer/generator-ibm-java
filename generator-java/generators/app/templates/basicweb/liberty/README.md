## Basic Web
Bluemix Basic Web Starter in Java

[![](https://img.shields.io/badge/bluemix-powered-blue.svg)](https://bluemix.net)
[![Platform](https://img.shields.io/badge/platform-java-lightgrey.svg?style=flat)](https://www.ibm.com/developerworks/learn/java/)

### Table of Contents
* [Summary](#summary)
* [Requirements](#requirements)
* [Configuration](#configuration)
* [Project contents](#project-contents)
* [Run](#run)

### Summary

The Bluemix Basic Web Starter in Java provides a starting point for creating web applications running on [WebSphere Liberty](https://developer.ibm.com/wasdev/).

To deploy this application to Bluemix using a toolchain click the **Create Toolchain** button.
[![Create Toolchain](https://console.ng.bluemix.net/devops/graphics/create_toolchain_button.png)](https://console.ng.bluemix.net/devops/setup/deploy/)

### Requirements
{{#has buildType 'maven'}}
* [Maven](https://maven.apache.org/install.html)
{{/has}}
{{#has buildType 'gradle'}}
* [Gradle](https://gradle.org/install)
{{/has}}
* Java 8: Any compliant JVM should work.
  * [Java 8 JDK from Oracle](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
  * [Java 8 JDK from IBM (AIX, Linux, z/OS, IBM i)](http://www.ibm.com/developerworks/java/jdk/),
    or [Download a Liberty server package](https://developer.ibm.com/assets/wasdev/#filter/assetTypeFilters=PRODUCT)
    that contains the IBM JDK (Windows, Linux)

### Configuration
The application is configured to provide Servlet capabilities.

These capabilities are provided through dependencies in the {{#has buildType 'maven'}}pom.xml{{/has}}{{#has buildType 'gradle'}}build.gradle{{/has}} file and Liberty features enabled in the server config file found in `src/main/liberty/config/server.xml`.

### Project contents
The context root is set in the `src/main/webapp/WEB-INF/ibm-web-ext.xml` file. The ports are set in the {{#has buildType 'maven'}}pom.xml{{/has}}{{#has buildType 'gradle'}}build.gradle{{/has}} file and exposed to the CLI in the cli-config.yml file.

The project contains Bluemix specific files that are used to deploy the application as part of a Bluemix DevOps flow. The `.bluemix` directory contains files used to define the Bluemix toolchain and pipeline for your application. The `manifest.yml` file specifies the name of your application in Bluemix, the timeout value during deployment and which services to bind to.

{{#bluemix}}
{{#server.services}}
This web application is configured to connect to the following services :
{{/server.services}}
{{#cloudant}}
* [Bluemix Cloudant service](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db).
{{/cloudant}}
{{#objectStorage}}
* [Bluemix Object Storage service](https://console.ng.bluemix.net/catalog/services/object-storage).
{{/objectStorage}}

Credentials are either taken from the VCAP_SERVICES environment variable that Bluemix provides or from environment variables passed in by JNDI (see the server config file `src/main/liberty/config/server.xml`).
{{/bluemix}}

### Run

To build and run the application:
1. {{#has buildType 'maven'}}`mvn install`{{/has}}{{#has buildType 'gradle'}}`gradle build`{{/has}}
1. {{#has buildType 'maven'}}`mvn liberty:run-server`{{/has}}{{#has buildType 'gradle'}}`gradle libertyStart`{{/has}}
{{#has buildType 'gradle'}}1. To stop the application run `gradle libertyStop`{{/has}}

To run the application in Docker use the Docker file called `Dockerfile`. If you do not want to install {{#has buildType 'maven'}}Maven{{/has}}{{#has buildType 'gradle'}}Gradle{{/has}} locally you can use `Dockerfile-tools` to build a container with {{#has buildType 'maven'}}Maven{{/has}}{{#has buildType 'gradle'}}Gradle{{/has}} installed.

### Endpoints

The application exposes the following endpoints:
* Health endpoint: `<host>:<port>/<contextRoot>/rest/health`
* Web content: `<host>:<port>/<contextRoot>`

The context root is set in the `src/main/webapp/WEB-INF/ibm-web-ext.xml` file. The ports are set in the {{#has buildType 'maven'}}pom.xml{{/has}}{{#has buildType 'gradle'}}build.gradle{{/has}} file and exposed to the CLI in the cli-config.yml file.

### Notices

This project was generated using:
{{#each genVersions}}
* {{@key}} v{{this}}
{{/each}}
