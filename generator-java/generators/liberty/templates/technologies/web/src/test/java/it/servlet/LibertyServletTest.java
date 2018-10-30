package it.servlet;

import it.EndpointTest;

import org.junit.Test;

public class LibertyServletTest extends EndpointTest {

    @Test
    public void testDeployment() {
        testEndpoint("/servlet", "Hello, from a Servlet!");
    }
}
