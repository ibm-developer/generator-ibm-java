{
  "excludes" : [
    "build.gradle"
  ],
  "excludesDir" : [
    "donotprocess"
  ],
  "composition" : [
    "subTemplate"
  ],
  fileFound : function(path, contents, config) {
    var fragment = {path : 'altered' + path, template : contents, data : config};
    return [fragment];
  },
}
