package com.example.Spring_Boot.services;

public interface EmailService {

    void sendAccountCreatedEmail(String toEmail, String userName);

    void sendResetOtpEmail(String toEmail, String otp);

    void sendOtpEmail(String toEmail, String otp);
}
