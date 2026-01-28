package om.community.supportsystem.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Profile("fly")
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl == null || databaseUrl.isEmpty()) {
            throw new RuntimeException("DATABASE_URL environment variable is not set");
        }
        
        System.out.println("🔍 Original DATABASE_URL: " + databaseUrl);
        
        try {
            // Handle both postgresql:// and postgres:// schemes
            String normalizedUrl = databaseUrl.replace("postgres://", "postgresql://");
            URI uri = new URI(normalizedUrl);
            
            String host = uri.getHost();
            int port = uri.getPort() == -1 ? 5432 : uri.getPort();
            String database = uri.getPath();
            
            if (database.startsWith("/")) {
                database = database.substring(1); // Remove leading slash
            }
            
            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + database;
            
            String userInfo = uri.getUserInfo();
            if (userInfo == null) {
                throw new RuntimeException("No user info found in DATABASE_URL");
            }
            
            String[] credentials = userInfo.split(":", 2);
            if (credentials.length != 2) {
                throw new RuntimeException("Invalid user info format in DATABASE_URL");
            }
            
            String username = credentials[0];
            String password = credentials[1];
            
            System.out.println("✅ Parsed database connection:");
            System.out.println("   Host: " + host);
            System.out.println("   Port: " + port);
            System.out.println("   Database: " + database);
            System.out.println("   Username: " + username);
            System.out.println("   JDBC URL: " + jdbcUrl);
            
            return DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
                
        } catch (URISyntaxException e) {
            throw new RuntimeException("Failed to parse DATABASE_URL: " + databaseUrl, e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create DataSource: " + e.getMessage(), e);
        }
    }
}