{
  "excludes" : [
    "build.gradle"
  ],
  "excludesDir" : [
    "donotprocess"
  ],
  fileFound : function(path, contents, config) {
    var fragment = {path : 'altered' + path, template : contents, data : config};
    return [fragment];
  }
}
