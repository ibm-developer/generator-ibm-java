{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has technologies 'springboot_web'}}
    "src/main/java/application/rest/HealthEndpoint.java"
    {{/has}}
  ]
}
