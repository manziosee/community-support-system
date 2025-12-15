package om.community.supportsystem.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseConfig {
    // Spring Boot auto-configuration handles datasource creation based on profiles
    // No custom beans needed - configuration is handled via application-{profile}.properties
}