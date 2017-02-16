package application.api.v1;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Application;

import com.cloudant.client.api.CloudantClient;

@Path("v1/health")
public class HealthEndpoint extends Application {

    @Inject
    protected CloudantClient client;

    @GET
    public String hello() {
        List<String> list;
        try {
            list = client.getAllDbs();
        } catch (NullPointerException e) {
            e.printStackTrace();
            return e.getMessage();
        }
        return list.toString();
    }

}
