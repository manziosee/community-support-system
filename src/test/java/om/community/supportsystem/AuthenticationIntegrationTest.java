package om.community.supportsystem;

import com.fasterxml.jackson.databind.ObjectMapper;
import om.community.supportsystem.dto.LoginRequest;
import om.community.supportsystem.dto.RegisterRequest;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
public class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testUserRegistration() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPhoneNumber("1234567890");
        registerRequest.setPassword("password123");
        registerRequest.setRole(UserRole.CITIZEN);
        registerRequest.setProvince("Kigali City");
        registerRequest.setDistrict("Gasabo");
        registerRequest.setSector("Test Sector");
        registerRequest.setCell("Test Cell");
        registerRequest.setVillage("Test Village");

        // Registration now requires email verification — returns a message, not a token
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    public void testUserLogin() throws Exception {
        // First register a user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Login Test User");
        registerRequest.setEmail("login@example.com");
        registerRequest.setPhoneNumber("9876543210");
        registerRequest.setPassword("password123");
        registerRequest.setRole(UserRole.VOLUNTEER);
        registerRequest.setProvince("Eastern Province");
        registerRequest.setDistrict("Nyagatare");
        registerRequest.setSector("Karangazi");
        registerRequest.setCell("Karangazi");
        registerRequest.setVillage("Karangazi");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        // Login now always requires OTP — first call returns requiresTwoFactor=true
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requiresTwoFactor").value(true));
    }

    @Test
    public void testPasswordResetRequest() throws Exception {
        // Endpoint always returns 200 with a message (doesn't reveal if email exists)
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"nobody@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }
}