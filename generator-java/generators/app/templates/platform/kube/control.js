{
  "excludes" : [
    {{#has frameworkType 'spring'}}
    "Jenkinsfile"
    {{/has}}
  ],
  {{! take helm files in chart directory and write to chart/appName.toLowerCase() in generated project }}
  fileFound : function(path, contents, config) {
    var defaultFragment = {path : path, template : contents, data : config};
    if(path.startsWith('chart')) {
      defaultFragment.path = path.replace('chart', 'chart/' + config.appName.toLowerCase());
    }
    return [defaultFragment];
  }
}