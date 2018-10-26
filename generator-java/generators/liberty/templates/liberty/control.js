{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has createType 'picnmix'}}
    "src/main/webapp/index.html",
    {{/has}}
    {{#has createType 'microservice/liberty'}}
    "src/main/webapp/index.html"
    {{/has}}
    {{#has createType 'bff/liberty'}}
    "src/main/webapp/index.html"
    {{/has}}
  ]
}
