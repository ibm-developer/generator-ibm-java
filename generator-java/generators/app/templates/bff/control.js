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
    if(path.endsWith('Bean.java')) {
      if(config.data.input.definitions) {
        var defs = config.data.input.definitions;
        var fragments = [];
        for (var prop in defs) {
          if (defs.hasOwnProperty(prop)) {
            var fragment = {
              path : path.replace('Bean.java', javarules.className(prop) + '.java'),
              template : contents,
              data : {data : {}}
            }
            fragment.data.data[prop] = defs[prop];
            fragments.push(fragment);
          }
        }
        return fragments;
      } else {
        return [defaultFragment];
      }
    }
    return [defaultFragment];
  }
}
