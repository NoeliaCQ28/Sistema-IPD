package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.ChangePasswordRequestDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorProfileUpdateDTO; // <-- NUEVA IMPORTACIÓN
import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Repository.AdministradorRepository;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import com.ipdsystem.sistemaipd.Service.EntrenadorService; // <-- NUEVA IMPORTACIÓN
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
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

    @Autowired
    private EntrenadorService entrenadorService; // <-- NUEVO CAMPO

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO request,
                                            @AuthenticationPrincipal UserDetails currentUser) {
        String username = currentUser.getUsername();

        // Lógica para cambiar contraseña (ya existente)
        Optional<Administrador> adminOpt = administradorRepository.findByCorreo(username);
        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();
            if (passwordEncoder.matches(request.getOldPassword(), admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
                administradorRepository.save(admin);
                return ResponseEntity.ok(Map.of("message", "Contraseña de Administrador actualizada con éxito."));
            }
        }

        Optional<Deportista> deportistaOpt = deportistaRepository.findByCorreo(username);
        if (deportistaOpt.isPresent()) {
            Deportista deportista = deportistaOpt.get();
            if (passwordEncoder.matches(request.getOldPassword(), deportista.getPassword())) {
                deportista.setPassword(passwordEncoder.encode(request.getNewPassword()));
                deportistaRepository.save(deportista);
                return ResponseEntity.ok(Map.of("message", "Contraseña de Deportista actualizada con éxito."));
            }
        }

        Optional<Entrenador> entrenadorOpt = entrenadorRepository.findByCorreo(username);
        if (entrenadorOpt.isPresent()) {
            Entrenador entrenador = entrenadorOpt.get();
            if (passwordEncoder.matches(request.getOldPassword(), entrenador.getPassword())) {
                entrenador.setPassword(passwordEncoder.encode(request.getNewPassword()));
                entrenadorRepository.save(entrenador);
                return ResponseEntity.ok(Map.of("message", "Contraseña de Entrenador actualizada con éxito."));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "La contraseña antigua es incorrecta."));
    }

    // --- NUEVO ENDPOINT AÑADIDO ---
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody EntrenadorProfileUpdateDTO profileDTO, @AuthenticationPrincipal UserDetails currentUser) {
        if (currentUser instanceof Entrenador) {
            Long entrenadorId = ((Entrenador) currentUser).getId();
            try {
                entrenadorService.updateProfile(entrenadorId, profileDTO);
                return ResponseEntity.ok(Map.of("message", "Perfil actualizado con éxito."));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
            }
        }
        // Aquí se podría añadir lógica para otros roles si fuera necesario
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Esta función solo está disponible para entrenadores."));
    }
}
    