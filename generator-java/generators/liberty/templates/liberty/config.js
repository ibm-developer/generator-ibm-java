{
  "properties" : [
    {"name" : "testServerHttpPort", "value" : "9080"},
    {"name" : "testServerHttpsPort", "value" : "9443"},
    {{#has buildType 'gradle'}}
    {"name" : "serverDirectory", "value" : "\"${buildDir}/wlp/usr/servers/defaultServer\""},
    {{/has}}
    {"name" : "warContext", "value" : {{#has buildType 'maven'}}"${app.name}"{{/has}}{{#has buildType 'gradle'}}"\"${appName}\""{{/has}} },
    {"name" : {{#has buildType 'maven'}}"package.file"{{/has}}{{#has buildType 'gradle'}}"packageFile"{{/has}}, "value" : {{#has buildType 'maven'}}"${project.build.directory}/${project.artifactId}-${project.version}.zip"{{/has}}{{#has buildType 'gradle'}}"\"${project.buildDir}/${rootProject.name}-${version}.zip\""{{/has}} },
    {"name" : {{#has buildType 'maven'}}"packaging.type"{{/has}}{{#has buildType 'gradle'}}"packagingType"{{/has}}, "value" : {{#has buildType 'maven'}}"usr"{{/has}}{{#has buildType 'gradle'}}"'usr'"{{/has}} }
  ],
  "dependencies" : [
    {"groupId" : "junit", "artifactId" : "junit", "version" : "4.12", "scope" : "test"},
    {"groupId" : "org.apache.cxf", "artifactId" : "cxf-rt-rs-client", "version" : "3.1.11", "scope" : "test"},
    {"groupId" : "org.glassfish", "artifactId" : "javax.json", "version" : "1.0.4", "scope" : "test"},
    {{#javametrics}}
    {"groupId" : "com.ibm.runtimetools", "artifactId" : "javametrics-agent", "version" : "[1.2,2.0)", "scope" : "provided"},
    {"groupId" : "com.ibm.runtimetools", "artifactId" : "javametrics-dash", "version" : "[1.2,2.0)", "scope" : "provided", "type" : "war"},
    {"groupId" : "com.ibm.runtimetools", "artifactId" : "javametrics-rest", "version" : "[1.2,2.0)", "scope" : "provided", "type" : "war"}
    {{/javametrics}}
  ],
  "frameworkDependencies" : [
    {{#javametrics}}
    {"feature" : "jsp-2.3"},
    {"feature" : "servlet-3.1"},
    {"feature" : "managedBeans-1.0"},
    {"feature" : "websocket-1.1"}
    {{/javametrics}}
  ]
}
