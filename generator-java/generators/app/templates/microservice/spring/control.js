{
  "excludes" : [
    ".classpath",
    ".project"
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ],
  "composition" : [
    "@arf/generator-spring:build",
    "@arf/generator-spring:config",
    "common",
    "platform/cli",
    "platform/bluemix",
    "platform/kube",
    {{#bluemix}}
    {{#server.services}}
    "services/common-spring",
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
