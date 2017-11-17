package application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
{{#bluemix}}
{{#mongodb}}
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
{{/mongodb}}
{{/bluemix}}

@SpringBootApplication
{{#bluemix}}
{{#mongodb}}
@EnableAutoConfiguration(exclude={MongoAutoConfiguration.class, MongoDataAutoConfiguration.class})
{{/mongodb}}
{{/bluemix}}
public class SBApplication {

    public static void main(String[] args) {
        SpringApplication.run(SBApplication.class, args);
    }
}
