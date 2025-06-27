package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.ChangePasswordRequestDTO;
import com.ipdsystem.sistemaipd.Dto.DeportistaProfileUpdateDTO;
import com.ipdsystem.sistemaipd.Dto.EntrenadorProfileUpdateDTO;
import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Repository.AdministradorRepository;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import com.ipdsystem.sistemaipd.Service.DeportistaService;
import com.ipdsystem.sistemaipd.Service.EntrenadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private EntrenadorService entrenadorService;

    @Autowired
    private DeportistaService deportistaService;

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

    // --- ENDPOINT CORREGIDO Y MÁS ROBUSTO ---
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileDTO, @AuthenticationPrincipal UserDetails currentUser) {

        try {
            if (currentUser instanceof Entrenador) {
                Long entrenadorId = ((Entrenador) currentUser).getId();
                EntrenadorProfileUpdateDTO entrenadorDTO = new EntrenadorProfileUpdateDTO();
                entrenadorDTO.setCorreo(profileDTO.get("correo"));
                entrenadorDTO.setTelefono(profileDTO.get("telefono"));

                entrenadorService.updateProfile(entrenadorId, entrenadorDTO);
                return ResponseEntity.ok(Map.of("message", "Perfil de entrenador actualizado con éxito."));
            }

            if (currentUser instanceof Deportista) {
                Long deportistaId = ((Deportista) currentUser).getId();
                DeportistaProfileUpdateDTO deportistaDTO = new DeportistaProfileUpdateDTO();
                deportistaDTO.setCorreo(profileDTO.get("correo"));
                deportistaDTO.setTelefono(profileDTO.get("telefono"));

                // CORRECCIÓN: Manejo seguro de valores nulos o vacíos para el campo "peso".
                String pesoStr = profileDTO.get("peso");
                if (pesoStr != null && !pesoStr.isEmpty()) {
                    deportistaDTO.setPeso(Double.parseDouble(pesoStr));
                }

                deportistaService.updateProfile(deportistaId, deportistaDTO);
                return ResponseEntity.ok(Map.of("message", "Perfil de deportista actualizado con éxito."));
            }

            // Si el rol no es ni Entrenador ni Deportista
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Esta función no está disponible para tu rol."));

        } catch (NumberFormatException e) {
            // Error si el peso no es un número válido
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "El formato del peso no es válido."));
        } catch (Exception e) {
            // Captura cualquier otra excepción del servicio (ej. 'Usuario no encontrado')
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
