package com.ipdsystem.sistemaipd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.ipdsystem.sistemaipd.*"})
@EntityScan("com.ipdsystem.sistemaipd.Entity")
@EnableJpaRepositories("com.ipdsystem.sistemaipd.Repository")
public class SistemaIpdApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaIpdApplication.class, args);
    }

}