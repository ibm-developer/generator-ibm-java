{
  "excludes" : [
{{#if bluemix.openApiServers}}
    "src/main/java/application/SBApplication.java",
{{/if}}
    ".classpath",
    ".project"
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ],
  "composition" : [
    "common",
    "spring:build",
    "spring:config"
  ]
}
