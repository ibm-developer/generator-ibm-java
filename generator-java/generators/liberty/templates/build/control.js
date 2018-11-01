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
  ]
}
