{
  {{#bluemix}}
  {{#cloudant}}
  "envEntries" : [
    {"name" : "CLOUDANT_URL", "value" : "{{url}}"},
    {"name" : "CLOUDANT_PASSWORD", "value" : "{{password}}"},
    {"name" : "CLOUDANT_USERNAME", "value" : "{{username}}"}
  ],
  "jndiEntries" : [
    {"name" : "cloudant/url", "value" : "${env.CLOUDANT_URL}"},
    {"name" : "cloudant/username", "value" : "${env.CLOUDANT_USERNAME}"},
    {"name" : "cloudant/password", "value" : "${env.CLOUDANT_PASSWORD}"}
  ],
  {{/cloudant}}
  {{/bluemix}}
  "dependencies" : [
    {"groupId" : "com.cloudant", "artifactId" : "cloudant-client", "version" : "2.7.0"}
  ]
}
