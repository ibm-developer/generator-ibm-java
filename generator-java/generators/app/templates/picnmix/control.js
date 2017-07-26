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
    "@arf/generator-liberty:liberty"
  ]
}
