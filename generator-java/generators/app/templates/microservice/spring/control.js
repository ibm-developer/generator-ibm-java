{
  "excludes" : [
    ".classpath",
    ".project"
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ],
  "composition" : [
    {{#each platforms}}
    "platform/{{this}}",
    {{/each}}
    "common",
    "@arf/generator-spring:build",
    "@arf/generator-spring:config"
  ]
}
