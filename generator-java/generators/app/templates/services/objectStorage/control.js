{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has frameworkType 'liberty'}}
    "src/main/java/application/objectstorage/ObjectStorageConfig.java"
    {{/has}}
    {{#has frameworkType 'spring'}}
    "src/main/java/application/objectstorage/ObjectStorage.java"
    {{/has}}
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ]
}