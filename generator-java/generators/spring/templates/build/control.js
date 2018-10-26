{
  "excludes" : [
    {{#has buildType 'maven'}}
    "build.gradle",
    "settings.gradle",
    {{/has}}

    {{#has buildType 'gradle'}}
    "pom.xml",
    {{/has}}
    ".classpath",
    ".project"
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ],
  "composition" : []
}
