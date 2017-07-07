{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has buildType 'maven'}}
    "build.gradle",
    "settings.gradle",
    {{/has}}

    {{#has buildType 'gradle'}}
    "pom.xml",
    {{/has}}
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ],
  "composition" : [
    "common",
    "@arf/generator-liberty:build",
    "platform/cli",
    "platform/bluemix",
    "platform/kube",
    "@arf/generator-liberty:liberty",
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
  ]
}
