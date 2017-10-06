## Backend For Frontend (BFF)
Bluemix BFF Starter in Java

[![](https://img.shields.io/badge/bluemix-powered-blue.svg)](https://bluemix.net)
[![Platform](https://img.shields.io/badge/platform-java-lightgrey.svg?style=flat)](https://www.ibm.com/developerworks/learn/java/)

### Table of Contents
* [Summary](#summary)
* [Requirements](#requirements)
* [Configuration](#configuration)
* [Project contents](#project-contents)
* [Run](#run)

### Summary

The Bluemix BFF Starter in Java provides a starting point for creating Java BFF applications running on [Spring](https://spring.io/).

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
  * [Java 8 JDK from IBM (AIX, Linux, z/OS, IBM i)](http://www.ibm.com/developerworks/java/jdk/)

### Configuration
Capabilities are provided through dependencies in the {{#has buildType 'maven'}}pom.xml{{/has}}{{#has buildType 'gradle'}}build.gradle{{/has}} file.

### Project contents
The BFF application has a health endpoint which is accessible at `<host>:<port>/health`. The ports are set to the defaults of 8080 for http and 8443 for https and are exposed to the CLI in the cli-config.yml file.

The project contains Bluemix specific files that are used to deploy the application as part of a Bluemix DevOps flow. The `.bluemix` directory contains files used to define the Bluemix toolchain and pipeline for your application. The `manifest.yml` file specifies the name of your application in Bluemix, the timeout value during deployment and which services to bind to.

{{#bluemix}}
{{#server.services}}
This BFF application is configured to connect to the following services :
{{/server.services}}
{{#cloudant}}
* [Bluemix Cloudant service](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db).
{{/cloudant}}
{{#objectStorage}}
* [Bluemix Object Storage service](https://console.ng.bluemix.net/catalog/services/object-storage).
{{/objectStorage}}

Credentials are either taken from the VCAP_SERVICES environment variable that Bluemix provides or from environment variables passed in by the config file `src/main/resources/application-local.properties`.
{{/bluemix}}

### Run

To build and run the application:
1. {{#has buildType 'maven'}}`mvn install`{{/has}}{{#has buildType 'gradle'}}`gradle build`{{/has}}
1. {{#has buildType 'maven'}}`java -jar ./target/{{artifactId}}-{{version}}.jar`{{/has}}{{#has buildType 'gradle'}}`gradle ./build/libs/{{artifactId}}-{{version}}.jar`{{/has}}

To run the application in Docker use the Docker file called `Dockerfile`. If you do not want to install {{#has buildType 'maven'}}Maven{{/has}}{{#has buildType 'gradle'}}Gradle{{/has}} locally you can use `Dockerfile-tools` to build a container with {{#has buildType 'maven'}}Maven{{/has}}{{#has buildType 'gradle'}}Gradle{{/has}} installed.

### Endpoints

The application exposes the following endpoints:
* Health endpoint: `<host>:<port>/health` e.g. http://localhost:8080/health

The ports are set in the {{#has buildType 'maven'}}pom.xml{{/has}}{{#has buildType 'gradle'}}build.gradle{{/has}} file and exposed to the CLI in the cli-config.yml file.

### Notices

This project was generated using:
{{#each genVersions}}
* {{@key}} v{{this}}
{{/each}}
