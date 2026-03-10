package com.hissus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HissusApplication {

  public static void main(String[] args) {
    SpringApplication.run(HissusApplication.class, args);
  }
}
