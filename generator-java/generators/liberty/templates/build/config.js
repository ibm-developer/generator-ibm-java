{
    "dependencies" : [
{{#if bluemix.openApiServers}}
        {"groupId" : "io.swagger", "artifactId" : "swagger-annotations", "version" : "1.5.3", "scope" : "provided"},
        {"groupId" : "javax.ws.rs", "artifactId" : "javax.ws.rs-api", "version" : "2.0.1", "scope" : "provided"},
        {"groupId" : "javax.validation", "artifactId" : "validation-api", "version" : "1.1.0.Final", "scope" : "provided"},
        {"groupId" : "com.fasterxml.jackson.core", "artifactId" : "jackson-annotations", "version" : "2.9.0", "scope" : "provided"},
        {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.jaxrs20", "version" : "1.0.18", "scope" : "provided"}
{{/if}}
    ],
    "frameworkDependencies" : [
{{#if bluemix.openApiServers}}
        {"feature" : "apiDiscovery-1.0"},
        {"feature" : "jaxrs-2.0"}
{{/if}}
    ]
}