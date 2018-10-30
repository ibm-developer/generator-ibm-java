{
  "dependencies" : [
    {{#has buildType 'maven'}}
    {"groupId" : "org.eclipse.microprofile", "artifactId" : "microprofile", "version" : "1.2", "scope" : "provided", "type" : "pom"},
    {{/has}}
    {{#has buildType 'gradle'}}
    {"groupId" : "org.eclipse.microprofile", "artifactId" : "microprofile", "version" : "1.2", "scope" : "provided"},
    {{/has}}
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.jaxrs20", "version" : "1.0.18", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.json", "version" : "1.0.18", "scope" : "provided"}
  ],
  "frameworkDependencies" : [
    {"feature" : "microprofile-1.2"}
  ]
}
