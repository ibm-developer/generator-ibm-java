package application.springboot.web;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.autoconfigure.MessageSourceAutoConfiguration;
import org.springframework.boot.context.web.SpringBootServletInitializer;

@SpringBootApplication(exclude = MessageSourceAutoConfiguration.class)
public class SpringBootLibertyApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SpringBootLibertyApplication.class);
    }

}
