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
    "common",
    {{#has deployType 'bluemix'}}
    "platform/bluemix"
    {{/has}}
    "@arf/generator-liberty:liberty"
  ]
}
