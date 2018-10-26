package it.springboot.web;

import it.EndpointTest;

import org.junit.Test;

public class HelloControllerTest extends EndpointTest {


    @Test
    public void testDeployment() {
        testEndpoint("/springbootweb", "Hello from Spring Boot MVC running on Liberty!");
    }
}
