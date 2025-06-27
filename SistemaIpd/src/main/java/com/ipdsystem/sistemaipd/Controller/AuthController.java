package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.EntrenadorInfoDTO;
import com.ipdsystem.sistemaipd.Dto.UserResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Repository.AdministradorRepository;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    // --- INYECCIÓN DE DEPENDENCIAS ---
    // Inyectamos los repositorios para poder buscar los datos frescos del usuario.
    @Autowired private AdministradorRepository administradorRepository;
    @Autowired private DeportistaRepository deportistaRepository;
    @Autowired private EntrenadorRepository entrenadorRepository;

    @GetMapping("/me")
    @Transactional(readOnly = true) // <-- Asegura una sesión de base de datos activa
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        UserResponseDTO responseDto = new UserResponseDTO();
        String correo = userDetails.getUsername();

        // --- LÓGICA MEJORADA ---
        // En lugar de usar el objeto 'userDetails' directamente (que puede tener la sesión cerrada),
        // usamos su correo para volver a buscar la entidad completa desde la base de datos.
        // Esto garantiza que todas las relaciones (como el entrenador) se puedan cargar correctamente.

        if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"))) {
            Administrador admin = administradorRepository.findByCorreo(correo)
                    .orElseThrow(() -> new UsernameNotFoundException("Admin no encontrado: " + correo));

            responseDto.setId(admin.getId());
            responseDto.setNombres(admin.getNombres());
            responseDto.setApellidos(admin.getApellidos());
            responseDto.setCorreo(admin.getCorreo());
            responseDto.setRol(admin.getRol());

        } else if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ENTRENADOR"))) {
            Entrenador entrenador = entrenadorRepository.findByCorreo(correo)
                    .orElseThrow(() -> new UsernameNotFoundException("Entrenador no encontrado: " + correo));

            responseDto.setId(entrenador.getId());
            responseDto.setNombres(entrenador.getNombres());
            responseDto.setApellidos(entrenador.getApellidos());
            responseDto.setCorreo(entrenador.getCorreo());
            responseDto.setRol(entrenador.getRol());

        } else if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DEPORTISTA"))) {
            Deportista deportista = deportistaRepository.findByCorreo(correo)
                    .orElseThrow(() -> new UsernameNotFoundException("Deportista no encontrado: " + correo));

            responseDto.setId(deportista.getId());
            responseDto.setNombres(deportista.getNombres());
            responseDto.setApellidos(deportista.getApellidos());
            responseDto.setCorreo(deportista.getCorreo());
            responseDto.setRol(deportista.getRol());
            responseDto.setDisciplina(deportista.getDisciplina());

            if (deportista.getEntrenador() != null) {
                Entrenador entrenadorAsignado = deportista.getEntrenador();
                EntrenadorInfoDTO entrenadorInfo = new EntrenadorInfoDTO(
                        entrenadorAsignado.getId(),
                        entrenadorAsignado.getNombres() + " " + entrenadorAsignado.getApellidos()
                );
                responseDto.setEntrenador(entrenadorInfo);
            }
        }

        responseDto.setAuthorities(
                userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(responseDto);
    }
}
