package om.community.supportsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CommunitySupportSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommunitySupportSystemApplication.class, args);
	}

}
