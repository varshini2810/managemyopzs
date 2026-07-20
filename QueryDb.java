import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class QueryDb {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/billingos", "root", "rootpassword");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT email, password_hash, role FROM users");
        while(rs.next()) {
            System.out.println(rs.getString("email") + " | " + rs.getString("password_hash") + " | " + rs.getString("role"));
        }
        conn.close();
    }
}
