package application.rest.v1;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.ArrayList;
import java.util.List;
{{#bluemix}}
{{#server.services}}
import org.springframework.beans.factory.annotation.Autowired;
import application.bluemix.ServiceName;
{{/server.services}}
{{#cloudant}}
import com.cloudant.client.api.CloudantClient;
{{/cloudant}}
{{#objectStorage}}
import org.openstack4j.openstack.OSFactory;
import org.openstack4j.api.OSClient;
import org.openstack4j.model.storage.object.SwiftContainer;
import org.openstack4j.model.storage.object.SwiftAccount;
{{/objectStorage}}
{{/bluemix}}

@RestController
public class Example {

  {{#bluemix}}
  {{#cloudant}}
  @Autowired @ServiceName(name="{{serviceInfo.name}}")
  private CloudantClient client;
  {{/cloudant}}
  {{#objectStorage}}
  @Autowired @ServiceName(name="{{serviceInfo.name}}")
  private OSClient.OSClientV3 os;
  {{/objectStorage}}
  {{/bluemix}}

  @RequestMapping("v1/")
  public @ResponseBody ResponseEntity<String> example() {
    List<String> list = new ArrayList<>();
    //return a simple list of strings
    list.add("Some data");
    return new ResponseEntity<String>(list.toString(), HttpStatus.OK);
  }

  {{#bluemix}}
  {{#cloudant}}
  @RequestMapping("v1/cloudant")
  public @ResponseBody ResponseEntity<String> cloudant(){
      List<String> list = new ArrayList<>();
      try {
          list = client.getAllDbs();
      } catch (NullPointerException e) {
          return new ResponseEntity<String>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return new ResponseEntity<String>("Available databases : " + list.toString(), HttpStatus.OK);
  }
  {{/cloudant}}

  {{#objectStorage}}
  @RequestMapping("v1/objectstorage")
  public @ResponseBody ResponseEntity<String> objectstorage(){
      //cannot use the injected client directly as it was created on a different thread, so create a new one
      OSClient.OSClientV3 client = OSFactory.clientFromToken(os.getToken());
      List<? extends SwiftContainer> containers = new ArrayList<>();
      try {
    	  SwiftAccount account = client.objectStorage().account().get();
    	  containers = os.objectStorage().containers().list();
          return new ResponseEntity<String>("Account: " + account + " Containers: " + containers, HttpStatus.OK);
      } catch (NullPointerException e) {
          return new ResponseEntity<String>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
  {{/objectStorage}}
  {{/bluemix}}
}
