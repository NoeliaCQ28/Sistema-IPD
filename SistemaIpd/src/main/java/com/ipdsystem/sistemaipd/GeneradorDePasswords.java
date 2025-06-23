// La primera línea DEBE ser la declaración del paquete.
package com.ipdsystem.sistemaipd;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class GeneradorDePasswords {

    public static void main(String[] args) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        // IMPORTANTE: Pon aquí la contraseña que quieres usar para el admin
        String contraseñaEnTextoPlano = "12345";

        String hashGenerado = passwordEncoder.encode(contraseñaEnTextoPlano);

        System.out.println("--- NUEVO HASH PARA LA BASE DE DATOS ---");
        System.out.println(hashGenerado);
        System.out.println("----------------------------------------");
    }
}