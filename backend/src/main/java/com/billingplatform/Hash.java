import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Hash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Admin@123 -> " + encoder.encode("Admin@123"));
        System.out.println("Super@123 -> " + encoder.encode("Super@123"));
        System.out.println("password -> " + encoder.encode("password"));
        System.out.println("User@123 -> " + encoder.encode("User@123"));
    }
}
