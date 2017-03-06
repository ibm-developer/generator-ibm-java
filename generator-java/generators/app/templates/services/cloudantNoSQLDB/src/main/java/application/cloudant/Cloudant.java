package application.cloudant;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.json.JsonObject;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.VCAPServices;

public class Cloudant {

    @Resource(lookup="cloudant/url")
    protected String resourceUrl;

    @Resource(lookup="cloudant/username")
    protected String resourceUsername;

    @Resource(lookup="cloudant/password")
    protected String resourcePassword;

    @Produces
    public CloudantClient expose() throws InvalidCredentialsException {
        CloudantClient client = null;
        CloudantCredentials credentials;
        credentials = getCloudantCredentials();
        client = ClientBuilder.url(credentials.getUrl())
            .username(credentials.getUsername())
            .password(credentials.getPassword())
            .build();
        return client;
    }

    private CloudantCredentials getCloudantCredentials() throws InvalidCredentialsException {
        CloudantCredentials credentials;
        try {
            credentials = getCredentialsFromVCAP();
        } catch (InvalidCredentialsException e) {
            credentials = new CloudantCredentials(resourceUrl, resourceUsername, resourcePassword);
        }
        return credentials;
    }

    private CloudantCredentials getCredentialsFromVCAP() throws InvalidCredentialsException {
        VCAPServices vcap = new VCAPServices();
        JsonObject credentials = vcap.getCredentialsObject("cloudantNoSQLDB");
        String username = credentials.getJsonString("username").getString();
        String password = credentials.getJsonString("password").getString();
        String url = credentials.getJsonString("url").getString();
        CloudantCredentials creds = new CloudantCredentials(url, username, password);
        return creds;
    }

}
