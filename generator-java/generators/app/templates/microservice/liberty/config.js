{
  "dependencies" : [
    {"groupId" : "javax.servlet", "artifactId" : "javax.servlet-api", "version" : "3.1.0", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.servlet", "version" : "1.0.10", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.jaxrs20", "version" : "1.0.10", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.json", "version" : "1.0.10", "scope" : "provided"},
    {"groupId" : "io.microprofile", "artifactId" : "microprofile", "version" : "1.0.0", "scope" : "provided", "type" : "pom"}
  ],
  "frameworkDependencies" : [
    {"feature" : "microprofile-1.0"},
    {"feature" : "jndi-1.0"}
  ]
}
