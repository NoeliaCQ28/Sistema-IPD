package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.UserResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        UserResponseDTO responseDto = new UserResponseDTO();

        if (userDetails instanceof Administrador admin) {
            responseDto.setId(admin.getId());
            responseDto.setNombres(admin.getNombres());
            responseDto.setApellidos(admin.getApellidos());
            responseDto.setCorreo(admin.getCorreo());
            responseDto.setRol(admin.getRol());
        } else if (userDetails instanceof Entrenador entrenador) {
            responseDto.setId(entrenador.getId());
            responseDto.setNombres(entrenador.getNombres());
            responseDto.setApellidos(entrenador.getApellidos());
            responseDto.setCorreo(entrenador.getCorreo());
            responseDto.setRol(entrenador.getRol());
        } else if (userDetails instanceof Deportista deportista) {
            responseDto.setId(deportista.getId());
            responseDto.setNombres(deportista.getNombres());
            responseDto.setApellidos(deportista.getApellidos());
            responseDto.setCorreo(deportista.getCorreo());
            responseDto.setRol(deportista.getRol());
            responseDto.setDisciplina(deportista.getDisciplina()); // <-- CAMBIO AQUÍ
        }

        responseDto.setAuthorities(
                userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(responseDto);
    }
}