{
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
