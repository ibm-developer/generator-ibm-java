package application.springboot.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LibertyHelloController {

    @RequestMapping("/springbootweb")
    public String hello() {
        return "Hello from Spring Boot MVC running on Liberty!";
    }

}
