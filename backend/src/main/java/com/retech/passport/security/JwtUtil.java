package com.retech.passport.security;
import com.retech.passport.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.*;
@Component
public class JwtUtil {
    @Value("${retech.jwt.secret}") private String secret;
    @Value("${retech.jwt.expiration-ms}") private long expirationMs;
    private SecretKey key() {
        byte[] bytes = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(bytes);
    }
    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getUserId())
                .claim("role", user.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key())
                .compact();
    }
    public Claims parseToken(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }
    public String extractEmail(String token) { return parseToken(token).getSubject(); }
    public boolean isTokenValid(String token) {
        try { parseToken(token); return true; } catch (JwtException | IllegalArgumentException e) { return false; }
    }
}