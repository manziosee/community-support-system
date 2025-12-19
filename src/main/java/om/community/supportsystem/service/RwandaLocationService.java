package om.community.supportsystem.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class RwandaLocationService {
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private static final String BASE_URL = "https://rda-ad-divisions.onrender.com";
    
    @Autowired
    public RwandaLocationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }
    
    public List<String> getProvinces() {
        try {
            String url = BASE_URL + "/provinces";
            String response = restTemplate.getForObject(url, String.class);
            return parseDataArray(response);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch provinces: " + e.getMessage());
        }
    }
    
    public List<String> getDistricts(String province) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/districts")
                    .queryParam("province", province)
                    .toUriString();
            String response = restTemplate.getForObject(url, String.class);
            return parseDataArray(response);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch districts: " + e.getMessage());
        }
    }
    
    public List<String> getSectors(String province, String district) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/sectors")
                    .queryParam("province", province)
                    .queryParam("district", district)
                    .toUriString();
            String response = restTemplate.getForObject(url, String.class);
            return parseDataArray(response);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch sectors: " + e.getMessage());
        }
    }
    
    public List<String> getCells(String province, String district, String sector) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/cells")
                    .queryParam("province", province)
                    .queryParam("district", district)
                    .queryParam("sector", sector)
                    .toUriString();
            String response = restTemplate.getForObject(url, String.class);
            return parseDataArray(response);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch cells: " + e.getMessage());
        }
    }
    
    public List<String> getVillages(String province, String district, String sector, String cell) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/villages")
                    .queryParam("province", province)
                    .queryParam("district", district)
                    .queryParam("sector", sector)
                    .queryParam("cell", cell)
                    .toUriString();
            String response = restTemplate.getForObject(url, String.class);
            return parseDataArray(response);
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch villages: " + e.getMessage());
        }
    }
    
    private List<String> parseDataArray(String jsonResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode dataNode = rootNode.get("data");
            
            List<String> result = new ArrayList<>();
            if (dataNode != null && dataNode.isArray()) {
                for (JsonNode item : dataNode) {
                    result.add(item.asText());
                }
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response: " + e.getMessage());
        }
    }
}