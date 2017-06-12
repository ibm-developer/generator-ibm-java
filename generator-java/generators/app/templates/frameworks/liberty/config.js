{
  "properties" : [
    {"name" : "testServerHttpPort", "value" : "9080"},
    {"name" : "testServerHttpsPort", "value" : "9443"},
    {{#has buildType 'gradle'}}
    {"name" : "serverDirectory", "value" : "\"${buildDir}/wlp/usr/servers/defaultServer\""},
    {{/has}}
    {"name" : "warContext", "value" : {{#has buildType 'maven'}}"${app.name}"{{/has}}{{#has buildType 'gradle'}}"\"${appName}\""{{/has}} },
    {"name" : {{#has buildType 'maven'}}"package.file"{{/has}}{{#has buildType 'gradle'}}"packageFile"{{/has}}, "value" : {{#has buildType 'maven'}}"${project.build.directory}/${app.name}.zip"{{/has}}{{#has buildType 'gradle'}}"\"${project.buildDir}/${appName}.zip\""{{/has}} },
    {"name" : {{#has buildType 'maven'}}"packaging.type"{{/has}}{{#has buildType 'gradle'}}"packagingType"{{/has}}, "value" : {{#has buildType 'maven'}}"usr"{{/has}}{{#has buildType 'gradle'}}"'usr'"{{/has}} }
  ],
  "dependencies" : [
    {"groupId" : "junit", "artifactId" : "junit", "version" : "4.12", "scope" : "test"},
    {"groupId" : "org.apache.cxf", "artifactId" : "cxf-rt-rs-client", "version" : "3.1.1", "scope" : "test"},
    {"groupId" : "org.glassfish", "artifactId" : "javax.json", "version" : "1.0.4", "scope" : "test"}
  ]
}
