import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
public class JwtGen {
    public static void main(String[] args) {
        String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        String token = Jwts.builder()
                .setClaims(new HashMap<>())
                .setSubject("test@test.com")
                .claim("tenantId", "global")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
        System.out.println(token);
    }
}
