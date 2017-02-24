package application.api.v1;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.cloudant.client.api.CloudantClient;

@Path("v1/demo")
public class Demo extends Application {

    @Inject
    protected CloudantClient client;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response demo() {
        List<String> list;
        try {
            list = client.getAllDbs();
        } catch (NullPointerException e) {
            e.printStackTrace();
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
        return Response.ok(list.toString()).build();
    }

}
