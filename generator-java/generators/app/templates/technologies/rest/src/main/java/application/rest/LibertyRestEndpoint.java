package application.rest;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

@ApplicationPath("rest")
@Path("/")
public class LibertyRestEndpoint {

    @GET
    @Path("/")
    public String hello() {
        return "Hello from the REST endpoint!";
    }

}
