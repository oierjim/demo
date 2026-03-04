package com.ejie.x21a.security;

import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ejie.x38.security.PerimetralSecurityWrapper;
import com.ejie.x38.security.UserCredentials;

public class MyUserCredentials extends UserCredentials {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(MyUserCredentials.class);
	
	@Override
	public void afterCredentialsCreation(PerimetralSecurityWrapper perimetralSecurityWrapper, HttpServletRequest request){
		logger.info("Prueba conceptual de ejecucion");
	} 
}
