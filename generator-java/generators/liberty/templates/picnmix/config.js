{
  "dependencies" : [
    {{#missing technologies 'springbootweb'}}
    {"groupId" : "javax.ws.rs", "artifactId" : "javax.ws.rs-api", "version" : "2.0.1", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.jaxrs20", "version" : "1.0.18", "scope" : "provided"}
    {{/missing}}
  ],
  "frameworkDependencies" : [
    {{#missing technologies 'springbootweb'}}
    {"feature" : "jaxrs-2.0"}
    {{/missing}}
  ]
}
