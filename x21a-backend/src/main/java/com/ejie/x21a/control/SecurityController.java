package com.ejie.x21a.control;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ejie.x21a.security.MyUserCredentials;
import com.ejie.x38.security.UserCredentials;

import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/sessionInfo")
public class SecurityController {

    @GetMapping("/locale")
    public Map<String, String> changeLocale(HttpServletRequest request, HttpServletResponse response, String lang) {
        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
        if (localeResolver != null) {
            Locale locale = new Locale(lang);
            localeResolver.setLocale(request, response, locale);
        }
        Map<String, String> result = new HashMap<>();
        result.put("status", "success");
        result.put("locale", lang);
        return result;
    }

    @GetMapping
    public Map<String, Object> getSessionInfo(HttpServletRequest request) {
        Map<String, Object> sessionInfo = new HashMap<>();
        
        // Obtener idioma actual de la sesión de Spring
        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
        if (localeResolver != null) {
            sessionInfo.put("locale", localeResolver.resolveLocale(request).getLanguage());
        } else {
            sessionInfo.put("locale", "es");
        }

       // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       /*  
        if (auth != null && auth.isAuthenticated() && auth.getCredentials() instanceof MyUserCredentials) {
            MyUserCredentials user = (MyUserCredentials) auth.getCredentials();
            sessionInfo.put("authenticated", true);
            sessionInfo.put("name", user.getName());
            sessionInfo.put("surname1", user.getSurname());
            sessionInfo.put("roles", user.getUserProfiles());
        } else {
            sessionInfo.put("authenticated", false);
        }
        */

        sessionInfo.put("authenticated", true);
            sessionInfo.put("name","oier");
            sessionInfo.put("surname1", "jim");
            sessionInfo.put("roles", new String[]{"AB10B-IN-0001"});
        return sessionInfo;
    }

    @GetMapping("/login")
    public void login(HttpServletResponse response) throws IOException {
        // Redirigimos a la raíz de la aplicación (frontend)
        // Usamos setHeader para asegurar que la redirección sea relativa y no incluya el puerto 8080
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", "/");
    }
}
