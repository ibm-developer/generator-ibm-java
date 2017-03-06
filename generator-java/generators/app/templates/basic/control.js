{
  "excludes" : [
    {{#has buildType 'maven'}}
    "build.gradle",
    {{/has}}

    {{#has buildType 'gradle'}}
    "pom.xml",
    {{/has}}
  ],
  "composition" : [
    {{#bluemix}}
    {{#cloudant}}
    "services/cloudantNoSQLDB",
    {{/cloudant}}
    {{/bluemix}}
    "basic"
  ]
}
