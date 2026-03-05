package com.healdrive.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void envoyerValidationCompte(String email) {
        System.out.println("Email envoye a " + email);
    }
}
