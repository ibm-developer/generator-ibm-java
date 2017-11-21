package application.rest.v1;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.ArrayList;

{{#bluemix}}
{{#if server.services}}
import javax.inject.Inject;
{{/if}}
{{#cloudant}}
import com.cloudant.client.api.CloudantClient;
{{/cloudant}}
{{#objectStorage}}
import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.model.storage.object.SwiftAccount;
import org.openstack4j.model.storage.object.SwiftContainer;
{{/objectStorage}}
{{/bluemix}}

@Path("v1/example")
public class Example {

    {{#bluemix}}
    {{#cloudant}}
    @Inject
    protected CloudantClient client;
    {{/cloudant}}

    {{#objectStorage}}
    @Inject
    protected OSClientV3 os;
    {{/objectStorage}}
    {{/bluemix}}

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response example() {
        List<String> list = new ArrayList<>();
        //return a simple list of strings
        list.add("Congratulations, your application is up and running");
        return Response.ok(list.toString()).build();
    }

    {{#bluemix}}
    {{#cloudant}}
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("cloudant")
    public Response exampleCloudant() {
        List<String> list = new ArrayList<>();
        try {
            list = client.getAllDbs();
        } catch (NullPointerException e) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
        return Response.ok(list.toString()).build();
    }
    {{/cloudant}}

    {{#objectStorage}}
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("objectstorage")
    public Response exampleObjectStorage() {
        try {
          SwiftAccount account = os.objectStorage().account().get();
          List<? extends SwiftContainer> containers = os.objectStorage().containers().list();
          return Response.ok("Account: " + account + " Containers: " + containers).build();
        } catch (NullPointerException e) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }
    {{/objectStorage}}
    {{/bluemix}}
}
