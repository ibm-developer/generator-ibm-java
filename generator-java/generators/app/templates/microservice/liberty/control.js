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
    {{#each platforms}}
    "platform/{{this}}",
    {{/each}}
    {{#bluemix}}
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
    "common",
    "@arf/generator-liberty:build",
    "@arf/generator-liberty:liberty"
  ]
}
