package com.retech.passport.service;
import com.retech.passport.dto.*;
import com.retech.passport.exception.*;
import com.retech.passport.model.*;
import com.retech.passport.repository.*;
import com.retech.passport.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if(userRepository.existsByEmail(req.getEmail())) throw new ConflictException("Email already registered: "+req.getEmail());
        UserStatus status = (req.getRole()==UserRole.TECHNICIAN) ? UserStatus.PENDING : UserStatus.ACTIVE;
        User user = User.builder().name(req.getName()).email(req.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.getPassword())).role(req.getRole()).status(status).build();
        user = userRepository.save(user);
        return AuthResponse.builder().token(jwtUtil.generateToken(user)).user(UserDto.from(user)).build();
    }
    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase()).orElseThrow(()->new UnauthorizedException("Invalid email or password"));
        if(!passwordEncoder.matches(req.getPassword(),user.getPasswordHash())) throw new UnauthorizedException("Invalid email or password");
        if(user.getStatus()==UserStatus.BLOCKED) throw new UnauthorizedException("Account is blocked");
        return AuthResponse.builder().token(jwtUtil.generateToken(user)).user(UserDto.from(user)).build();
    }
}