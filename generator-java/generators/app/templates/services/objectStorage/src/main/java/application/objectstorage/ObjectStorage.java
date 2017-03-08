package application.objectstorage;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.json.JsonObject;

import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.VCAPServices;

public class ObjectStorage {

    @Resource(lookup="objectstorage/auth_url")
    protected String resourceUrl;

    @Resource(lookup="objectstorage/username")
    protected String resourceUsername;

    @Resource(lookup="objectstorage/password")
    protected String resourcePassword;
    
    @Resource(lookup="objectstorage/domain")
    protected String resourceDomain;

    @Resource(lookup="objectstorage/project")
    protected String resourceProject;

    @Produces
    public OSClientV3 expose() throws InvalidCredentialsException {
        ObjectStorageCredentials credentials;
        credentials = getObjectStorageCredentials();
        OSClientV3 os = OSFactory.builderV3()
                .endpoint(credentials.getAuthUrl().toString())
                .credentials(credentials.getUserId(), credentials.getPassword())
                .scopeToProject(credentials.getProjectIdent(), credentials.getDomainIdent())
                .authenticate();
        return os;
    }

    private ObjectStorageCredentials getObjectStorageCredentials() throws InvalidCredentialsException {
    	ObjectStorageCredentials credentials;
        try {
            credentials = getCredentialsFromVCAP();
        } catch (InvalidCredentialsException e) {
            credentials = new ObjectStorageCredentials(resourceUrl, resourceUsername, resourcePassword, resourceDomain, resourceProject);
        }
        return credentials;
    }

    private ObjectStorageCredentials getCredentialsFromVCAP() throws InvalidCredentialsException {
        VCAPServices vcap = new VCAPServices();
        JsonObject credentials = vcap.getCredentialsObject("Object-Storage");
        String username = credentials.getJsonString("userId").getString();
        String password = credentials.getJsonString("password").getString();
        String auth_url = credentials.getJsonString("auth_url").getString() + "/v3";
        String domain = credentials.getJsonString("domainName").getString();
        String project = credentials.getJsonString("project").getString();
        ObjectStorageCredentials creds = new ObjectStorageCredentials(auth_url, username, password, domain, project);
        return creds;
    }

}
