package com.example.Spring_Boot.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendAccountCreatedEmail(String toEmail, String userName) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🎉 Account Created Successfully");
        message.setText(
                "Hello " + userName + ",\n\n" +
                        "Your account has been created successfully.\n\n" +
                        "You can now log in and start using our services.\n\n" +
                        "If this was not you, please contact support immediately.\n\n" +
                        "Thanks,\n" +
                        "Authify Team"
        );

        mailSender.send(message);
    }

    @Override
    public void sendResetOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify Your Account - OTP");
        message.setText(
                "Your OTP for account verification is: " + otp +
                        "\n\nThis OTP will expire in 5 minutes."
        );
        mailSender.send(message);

    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify Your Account - OTP");
        message.setText(
                "Your OTP  is: " + otp +
                        "\n\n Verify Our Account Using this otp"
        );
        mailSender.send(message);
    }
}
