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
    "generator-ibm-java-spring:build",
    "generator-ibm-java-spring:config"
  ]
}
