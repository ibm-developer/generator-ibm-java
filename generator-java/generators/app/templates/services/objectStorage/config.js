{
  {{#bluemix}}
  {{#objectStorage}}
  "envEntries" : [
    {"name" : "OBJECTSTORAGE_AUTH_URL", "value" : "{{auth_url}}"},
    {"name" : "OBJECTSTORAGE_USERID", "value" : "{{userId}}"},
    {"name" : "OBJECTSTORAGE_PASSWORD", "value" : "{{password}}"},
    {"name" : "OBJECTSTORAGE_DOMAIN_NAME", "value" : "{{domainName}}"},
    {"name" : "OBJECTSTORAGE_PROJECT", "value" : "{{project}}"}
  ],
  "jndiEntries" : [
    {"name" : "objectstorage/auth_url", "value" : "${env.OBJECTSTORAGE_AUTH_URL}"},
    {"name" : "objectstorage/userId", "value" : "${env.OBJECTSTORAGE_USERID}"},
    {"name" : "objectstorage/password", "value" : "${env.OBJECTSTORAGE_PASSWORD}"},
    {"name" : "objectstorage/domainName", "value" : "${env.OBJECTSTORAGE_DOMAIN_NAME}"},
    {"name" : "objectstorage/project", "value" : "${env.OBJECTSTORAGE_PROJECT}"}
  ],
  {{/objectStorage}}
  {{/bluemix}}
  "dependencies" : [
    {"groupId" : "org.pacesys", "artifactId" : "openstack4j-core", "version" : "3.0.3"},
    {"groupId" : "org.pacesys.openstack4j.connectors", "artifactId" : "openstack4j-httpclient", "version" : "3.0.3"}
  ]
}
