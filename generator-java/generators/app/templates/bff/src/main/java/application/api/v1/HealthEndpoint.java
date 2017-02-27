package application.api.v1;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("v1/health")
public class HealthEndpoint extends Application {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response healthcheck() {
        return Response.ok().build();
    }

}
