package com.ureca.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import com.ureca.web.security.JwtAuthFilter;
import com.ureca.web.security.SessionAuthFilter;

@SpringBootApplication
@PropertySource("classpath:config/secu.properties")
@Configuration
public class StarbucksCloneApplication {

	public static void main(String[] args) {
		SpringApplication.run(StarbucksCloneApplication.class, args);
	}
	
	@Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtAuthFilterRegistration() {
        FilterRegistrationBean<JwtAuthFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new JwtAuthFilter());
        
        registration.addUrlPatterns("/getPhones");       // 이 필터가 적용될 URL 패턴 지정  
        
        // 숫자가 작을수록 우선순위가 높습니다.
        registration.setOrder(0); // 가장 먼저 실행되도록 0으로 설정
        registration.setName("jwtAuthFilter");

        return registration;
    }

}
