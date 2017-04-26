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
    "basic",
    "platform/kube",
    "frameworks/liberty",
    {{#each technologies}}
    "technologies/{{this}}",
    {{/each}}
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
