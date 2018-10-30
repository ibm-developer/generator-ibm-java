package application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
{{#bluemix}}
{{#mongodb}}
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
{{/mongodb}}
{{#if openApiServers.length}}
import org.springframework.context.annotation.ComponentScan;

import springfox.documentation.swagger2.annotations.EnableSwagger2;
{{else}}
{{#javametrics}}
import org.springframework.context.annotation.ComponentScan;
{{/javametrics}}
{{/if}}
{{/bluemix}}

@SpringBootApplication
{{#bluemix}}
{{#if openApiServers.length}}
@EnableSwagger2
@ComponentScan(basePackages = { "io.swagger", "application" {{#javametrics}}, "com.ibm.javametrics.spring"{{/javametrics}} })
{{else}}
{{#javametrics}}
@ComponentScan(basePackages = {"application", "com.ibm.javametrics.spring"})
{{/javametrics}}
{{/if}}
{{#mongodb}}
@EnableAutoConfiguration(exclude={MongoAutoConfiguration.class, MongoDataAutoConfiguration.class})
{{/mongodb}}
{{/bluemix}}
public class SBApplication {

    public static void main(String[] args) {
        SpringApplication.run(SBApplication.class, args);
    }
}
