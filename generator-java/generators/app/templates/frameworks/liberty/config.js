{
  "properties" : [
    {"name" : "testServerHttpPort", "value" : "9080"},
    {"name" : "testServerHttpsPort", "value" : "9443"},
    {{#has buildType 'gradle'}}
    {"name" : "serverDirectory", "value" : "\"${buildDir}/wlp/usr/servers/defaultServer\""},
    {{/has}}
    {"name" : "warContext", "value" : {{#has buildType 'maven'}}"${app.name}"{{/has}}{{#has buildType 'gradle'}}"\"${appName}\""{{/has}} },
    {"name" : {{#has buildType 'maven'}}"package.file"{{/has}}{{#has buildType 'gradle'}}"packageFile"{{/has}}, "value" : {{#has buildType 'maven'}}"${project.build.directory}/${app.name}.zip"{{/has}}{{#has buildType 'gradle'}}"\"${project.buildDir}/${appName}.zip\""{{/has}} },
    {"name" : {{#has buildType 'maven'}}"packaging.type"{{/has}}{{#has buildType 'gradle'}}"packagingType"{{/has}}, "value" : "usr"}
  ],
  "dependencies" : [
    {"groupId" : "javax.servlet", "artifactId" : "javax.servlet-api", "version" : "3.1.0", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.servlet", "version" : "1.0.10", "scope" : "provided"},
    {"groupId" : "javax.ws.rs", "artifactId" : "javax.ws.rs-api", "version" : "2.0.1", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.jaxrs20", "version" : "1.0.10", "scope" : "provided"},
    {"groupId" : "javax.json", "artifactId" : "javax.json-api", "version" : "1.0", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.json", "version" : "1.0.10", "scope" : "provided"},
    {"groupId" : "javax.enterprise", "artifactId" : "cdi-api", "version" : "1.2", "scope" : "provided"}
  ]
}
