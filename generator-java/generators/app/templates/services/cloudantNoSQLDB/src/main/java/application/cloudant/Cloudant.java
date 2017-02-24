package application.cloudant;

import java.io.StringReader;

import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonString;
import javax.enterprise.inject.Produces;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;

public class Cloudant {

    @Resource(lookup="cloudant/url")
    protected String resourceUrl;

    @Resource(lookup="cloudant/username")
    protected String resourceUsername;

    @Resource(lookup="cloudant/password")
    protected String resourcePassword;

    @Produces
    public CloudantClient expose() throws CloudantException {
        CloudantClient client = null;
        CloudantCredentials credentials;
        try {
            System.out.println("Cloudant url from: " + System.getenv("CLOUDANT_URL") + " from JNDI:" + resourceUrl);
            credentials = getCloudantCredentials();
            System.out.println("Found cloudant credentials - url:" + credentials.getUrl() +
                    ", username:" + credentials.getUsername() + ", password:" + credentials.getPassword());
        } catch (InvalidCredentialsException e) {
            throw new CloudantException(e.getMessage());
        }
        client = ClientBuilder.url(credentials.getUrl())
            .username(credentials.getUsername())
            .password(credentials.getPassword())
            .build();
        return client;
    }

    private CloudantCredentials getCloudantCredentials() throws InvalidCredentialsException {
        CloudantCredentials credentials;
        try {
            credentials = getCredentialsFromVCAP(System.getenv("VCAP_SERVICES"));
        } catch (InvalidCredentialsException e) {
            credentials = new CloudantCredentials(resourceUrl, resourceUsername, resourcePassword);
        }
        return credentials;
    }

    private CloudantCredentials getCredentialsFromVCAP(String vcapServicesEnv) throws InvalidCredentialsException {
        if (vcapServicesEnv == null) {
            throw new InvalidCredentialsException();
        }
        JsonObject vcapServices = Json.createReader(new StringReader(vcapServicesEnv)).readObject();
        JsonArray cloudantObjectArray = vcapServices.getJsonArray("cloudantNoSQLDB");
        JsonObject cloudantObject = cloudantObjectArray.getJsonObject(0);
        JsonObject cloudantCredentials = cloudantObject.getJsonObject("credentials");
        JsonString cloudantUsername = cloudantCredentials.getJsonString("username");
        String username = cloudantUsername.getString();
        JsonString cloudantPassword = cloudantCredentials.getJsonString("password");
        String password = cloudantPassword.getString();
        JsonString cloudantUrl = cloudantCredentials.getJsonString("url");
        String url = cloudantUrl.getString();
        CloudantCredentials creds = new CloudantCredentials(url, username, password);
        return creds;
    }

}
