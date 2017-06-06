package application.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/")
public class LibertyRestEndpoint {

    @GET
    public String hello() {
        return "Hello from the REST endpoint!";
    }

}
