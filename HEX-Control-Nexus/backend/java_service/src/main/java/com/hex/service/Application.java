package com.hex.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("HEX Control Nexus Java Service Started Successfully!");
        System.out.println("API available at: http://localhost:8080/api");
    }
}