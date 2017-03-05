package application.cloudant;

import java.net.MalformedURLException;
import java.net.URL;

public class CloudantCredentials {

    private String username;
    private String password;
    private URL url;

    public CloudantCredentials(String url, String username, String password) throws InvalidCredentialsException {
        checkCredentialsValid(url, username, password);
    }

    public URL getUrl() {
        return this.url;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    private void checkCredentialsValid(String url, String username, String password) throws InvalidCredentialsException {
        if (url == null || username == null || password == null) {
            throw new InvalidCredentialsException("Invalid cloudant credentials.");
        }
        try {
            this.url = new URL(url);
        } catch (MalformedURLException e) {
            throw new InvalidCredentialsException("MalformedURLException thrown while parsing url string:" + url);
        }
        this.username = username;
        this.password = password;
    }

}
