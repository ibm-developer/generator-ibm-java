package application.bluemix;

import java.io.StringReader;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

public class VCAPServices {

  public JsonObject getCredentialsObject(String serviceType) throws InvalidCredentialsException {
      String vcapServicesEnv = System.getenv("VCAP_SERVICES");
      if (vcapServicesEnv == null) {
          throw new InvalidCredentialsException();
      }
      JsonObject vcapServices = Json.createReader(new StringReader(vcapServicesEnv)).readObject();
      JsonArray serviceObjectArray = vcapServices.getJsonArray(serviceType);
      JsonObject serviceObject = serviceObjectArray.getJsonObject(0);
      JsonObject credentials = serviceObject.getJsonObject("credentials");
      return credentials;
  }
}
