{
  "properties" : [
    {"name" : {{#has buildType 'maven'}}"testName1"{{/has}}{{#has buildType 'gradle'}}"testGradleName1"{{/has}}, "value" : "testValue1"},
    {"name" : "testName2", "value" : {{#has buildType 'maven'}}"testValue2"{{/has}}{{#has buildType 'gradle'}}"testGradleValue2"{{/has}} }
  ]
}
