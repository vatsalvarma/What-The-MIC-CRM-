package com.whatthemic.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE events MODIFY COLUMN banner_url LONGTEXT");
				jdbcTemplate.execute("ALTER TABLE events MODIFY COLUMN event_date VARCHAR(255)");
				System.out.println("✅ Database Schema Updated: banner_url is LONGTEXT, event_date is VARCHAR");
			} catch (Exception e) {
				System.out.println("⚠️ Note on schema update: " + e.getMessage());
			}

			// Seed host user
			try {
				Integer hostCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE role = 'ROLE_HOST'", Integer.class);
				if (hostCount != null && hostCount == 0) {
					String encodedPassword = passwordEncoder.encode("host123");
					jdbcTemplate.update("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", "host", encodedPassword, "ROLE_HOST");
					System.out.println("✅ Seeded Host User");
				}
			} catch (Exception e) {
				System.out.println("⚠️ Note on host seeder: " + e.getMessage());
			}
		};
	}
}
