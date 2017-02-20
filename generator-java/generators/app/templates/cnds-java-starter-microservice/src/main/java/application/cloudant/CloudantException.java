package application.cloudant;

public class CloudantException extends Exception {

    public CloudantException() {
    }

    public CloudantException(String message) {
        super(message);
    }

    public CloudantException(Throwable cause) {
        super(cause);
    }

    public CloudantException(String message, Throwable cause) {
        super(message, cause);
    }

    public CloudantException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
