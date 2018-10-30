{
    "dependencies" : [
{{#if bluemix.openApiServers}}
        {"groupId" : "io.springfox", "artifactId" : "springfox-swagger2", "version" : "2.7.0"},
        {"groupId" : "io.springfox", "artifactId" : "springfox-swagger-ui", "version" : "2.7.0"},
        {"groupId" : "com.fasterxml.jackson.datatype", "artifactId" : "jackson-datatype-joda"},
        {"groupId" : "javax.validation", "artifactId" : "validation-api"}
{{/if}}
    ]
}