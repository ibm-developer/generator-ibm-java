{
  "excludes" : [
    {{#has buildType 'maven'}}
    "build.gradle",
    {{/has}}

    {{#has buildType 'gradle'}}
    "pom.xml",
    {{/has}}
  ],
  "composition" : [
    {{#bluemix}}
    {{#server.services}}
    "services/common",
    {{/server.services}}
    {{#cloudant}}
    "services/cloudantNoSQLDB",
    {{/cloudant}}
    {{#objectStorage}}
    "services/objectStorage",
    {{/objectStorage}}
    {{/bluemix}}
  ],
  fileFound : function(path, contents, config) {
    var defaultFragment = {path : path, template : contents, data : config};
    if(path == 'gitignore') {
      var fragment = {
        path : '.gitignore',
        template : contents,
        data : config
      }
      return [fragment];
    } else {
      return [defaultFragment];
    }
  }
}
