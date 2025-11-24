package com.test.Utility; 

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwUtil {
	
	private final SecretKey secret_Key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public String generateToken(String username) {
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(secret_Key)
                .compact();	
	}
	
	private Claims extractClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(secret_Key).build().parseClaimsJws(token).getBody();
	}
	
	
	public String extractUsername(String token) {
		return extractClaims(token).getSubject();
		
	}
	
	private boolean isTokenExpired(String token) {
		  return extractClaims(token).getExpiration().before(new Date());
	}

	public boolean validateToken(String token, String username) {
		return (extractUsername(token).equals(username) && !isTokenExpired(token));
	}
}
