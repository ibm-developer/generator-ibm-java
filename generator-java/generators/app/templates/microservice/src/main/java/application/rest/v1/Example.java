package application.rest.v1;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.ArrayList;

{{#bluemix}}
import javax.inject.Inject;
{{#cloudant}}
import com.cloudant.client.api.CloudantClient;
{{/cloudant}}
{{/bluemix}}

@Path("v1/example")
public class Example {

    {{#bluemix}}
    {{#cloudant}}
    @Inject
    protected CloudantClient client;
    {{/cloudant}}
    {{/bluemix}}

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response example() {
        List<String> list = new ArrayList<>();
        {{^bluemix}}
        //return a simple list of strings
        list.add("Some data");
        {{/bluemix}}

        {{#bluemix}}
        {{#cloudant}}
        try {
            list = client.getAllDbs();
        } catch (NullPointerException e) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
        {{/cloudant}}
        {{/bluemix}}
        return Response.ok(list.toString()).build();
    }
}
