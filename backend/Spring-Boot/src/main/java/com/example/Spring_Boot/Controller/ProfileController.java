package com.example.Spring_Boot.Controller;

import com.example.Spring_Boot.io.ProfileRequest;
import com.example.Spring_Boot.io.ProfileResponse;
import com.example.Spring_Boot.services.EmailService;
import com.example.Spring_Boot.services.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createProfile(request);
        emailService.sendAccountCreatedEmail(response.getEmail(), response.getName());
        return response;


    }

    @GetMapping("/test")
    public String test() {
        return "Auth is working";
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return profileService.getProfile(email);
    }

}
