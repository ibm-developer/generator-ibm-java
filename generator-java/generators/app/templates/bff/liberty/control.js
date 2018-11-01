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
    "liberty:build",
    "common",
    "liberty:liberty"
  ],
  fileFound : function(path, contents, config) {
    var defaultFragment = {path : path, template : contents, data : config};
    if(path.endsWith('Bean.java')) {
      if(config.input.definitions) {
        var defs = config.input.definitions;
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
