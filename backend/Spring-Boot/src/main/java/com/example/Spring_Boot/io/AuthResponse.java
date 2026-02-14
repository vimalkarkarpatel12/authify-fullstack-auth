package com.example.Spring_Boot.io;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String email;
    private String token;
}
