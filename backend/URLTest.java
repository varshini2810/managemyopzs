import java.io.InputStream;
import java.net.URL;
public class URLTest {
    public static void main(String[] args) throws Exception {
        URL url = new URL("https://via.placeholder.com/64x64.png?text=Logo");
        try (InputStream is = url.openStream()) {
            System.out.println("Success! Read: " + is.read());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
