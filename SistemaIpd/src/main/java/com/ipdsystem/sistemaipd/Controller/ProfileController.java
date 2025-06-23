package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.ChangePasswordRequestDTO; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Entity.Administrador; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Entity.Deportista; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Entity.Entrenador; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Repository.AdministradorRepository; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import jakarta.persistence.EntityNotFoundException; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.security.core.userdetails.UserDetails; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.security.crypto.password.PasswordEncoder; // <<<--- ¡AÑADIR ESTA IMPORTACIÓN!
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private DeportistaRepository deportistaRepository;

    @Autowired
    private EntrenadorRepository entrenadorRepository;


    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequestDTO request,
                                                 @AuthenticationPrincipal UserDetails currentUser) {
        String username = currentUser.getUsername(); // Correo del usuario logueado

        // Intentar encontrar al usuario en todas las tablas por su correo
        Optional<Administrador> adminOpt = administradorRepository.findByCorreo(username);
        Optional<Deportista> deportistaOpt = deportistaRepository.findByCorreo(username);
        Optional<Entrenador> entrenadorOpt = entrenadorRepository.findByCorreo(username);

        // Verificar y actualizar la contraseña del tipo de usuario encontrado
        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();
            if (passwordEncoder.matches(request.getOldPassword(), admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
                administradorRepository.save(admin);
                return ResponseEntity.ok("Contraseña de Administrador actualizada con éxito.");
            }
        } else if (deportistaOpt.isPresent()) {
            Deportista deportista = deportistaOpt.get();
            if (passwordEncoder.matches(request.getOldPassword(), deportista.getPassword())) {
                deportista.setPassword(passwordEncoder.encode(request.getNewPassword()));
                deportistaRepository.save(deportista);
                return ResponseEntity.ok("Contraseña de Deportista actualizada con éxito.");
            }
        } else if (entrenadorOpt.isPresent()) {
            Entrenador entrenador = entrenadorOpt.get();
            if (passwordEncoder.matches(request.getOldPassword(), entrenador.getPassword())) {
                entrenador.setPassword(passwordEncoder.encode(request.getNewPassword()));
                entrenadorRepository.save(entrenador);
                return ResponseEntity.ok("Contraseña de Entrenador actualizada con éxito.");
            }
        }

        // Si la contraseña antigua es incorrecta o el usuario no fue encontrado en ninguna tabla
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña antigua incorrecta o usuario no encontrado.");
    }
}