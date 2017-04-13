package application.rest;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Application;

@ApplicationPath("rest")
@Path("/")
public class LibertyRestEndpoint extends Application {

    @GET
    @Path("/")
    public String hello() {
        return "Hello from the REST endpoint!";
    }

}
