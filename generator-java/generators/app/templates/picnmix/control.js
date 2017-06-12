{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has technologies 'springboot_web'}}
    "src/main/java/application/rest/JaxrsApplication.java",
    "src/test/java/it/HealthEndpointIT.java"
    {{/has}}
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ],
  "composition" : [
    "basic",
    "frameworks/liberty",
    {{#bluemix}}
    "platform/cli",
    "platform/bluemix",
    {{#server.services}}
    "services/common",
    {{/server.services}}
    {{#cloudant}}
    "services/cloudantNoSQLDB",
    {{/cloudant}}
    {{#objectStorage}}
    "services/objectStorage",
    {{/objectStorage}}
    {{/bluemix}}
  ]
}
