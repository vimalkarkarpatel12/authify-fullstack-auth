package com.example.Spring_Boot.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "tbl_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    private String verifyOtp;

    private Boolean isAccountVerified = false;

    private Long verifyOtpExpireAt;
    private String resetOtp;
    private Long resetOtpExpireAt;


    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createAt;
    @UpdateTimestamp
    private Timestamp updatedAt;

}
