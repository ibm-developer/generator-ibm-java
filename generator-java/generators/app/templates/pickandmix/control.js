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
    ".settings",
    "build"
  ],
  "composition" : [
    "basic",
    "platform/cli",
    "platform/bluemix",
    "platform/kube",
    "frameworks/liberty",
    {{#each technologies}}
    "technologies/{{this.name}}",
    {{/each}}
  ]
}
