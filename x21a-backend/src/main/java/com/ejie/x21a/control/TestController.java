package com.ejie.x21a.control;

import java.util.Map;
import java.util.HashMap;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ejie.x38.security.UserCredentials;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hola desde Spring Boot con XLNetS");
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserCredentials) {
            UserCredentials user = (UserCredentials) auth.getPrincipal();
            response.put("user", user.getName() + " " + user.getSurname());
        } else {
            response.put("user", "Anónimo");
        }
        
        return response;
    }
}
