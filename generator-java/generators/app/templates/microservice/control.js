{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has buildType 'maven'}}
    "build.gradle",
    {{/has}}

    {{#has buildType 'gradle'}}
    "pom.xml",
    {{/has}}
  ],
  "excludesDir" : [
    "target",
    ".settings"
  ],
  "composition" : [
    "basic",
    {{#bluemix}}
    {{#cloudant}}
    "services/cloudantNoSQLDB",
    {{/cloudant}}
    {{/bluemix}}
    "microservice"
  ]
}
