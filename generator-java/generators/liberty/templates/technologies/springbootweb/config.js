{
  "dependencies" : [
    {"groupId" : "javax.servlet", "artifactId" : "javax.servlet-api", "version" : "3.1.0", "scope" : "provided"},
    {"groupId" : "com.ibm.websphere.appserver.api", "artifactId" : "com.ibm.websphere.appserver.api.servlet", "version" : "1.1.18", "scope" : "provided"},
    {"groupId" : "org.springframework.boot", "artifactId" : "spring-boot-starter-web", "version" : "1.3.0.RELEASE",
      "exclusions" : [
        {"groupId" : "org.springframework.boot", "artifactId" : "spring-boot-starter-tomcat"}
      ]
    }
  ],
  "frameworkDependencies" : [
    {"feature" : "servlet-3.1"}
  ]
}
