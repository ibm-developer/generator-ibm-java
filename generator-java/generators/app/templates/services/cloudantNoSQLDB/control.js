{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has frameworkType 'liberty'}}
    "src/main/java/application/cloudant/CloudantClientConfig.java"
    {{/has}}
    {{#has frameworkType 'spring'}}
    "src/main/java/application/cloudant/Cloudant.java"
    {{/has}}
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ]
}