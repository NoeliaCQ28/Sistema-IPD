package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Repository.AdministradorRepository;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdministradorRepository administradorRepository;
    private final DeportistaRepository deportistaRepository;
    private final EntrenadorRepository entrenadorRepository;

    @Autowired
    public CustomUserDetailsService(AdministradorRepository administradorRepository,
                                    DeportistaRepository deportistaRepository,
                                    EntrenadorRepository entrenadorRepository) {
        this.administradorRepository = administradorRepository;
        this.deportistaRepository = deportistaRepository;
        this.entrenadorRepository = entrenadorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        System.out.println("Buscando usuario en todos los roles con correo: " + correo);

        Optional<Administrador> adminOptional = administradorRepository.findByCorreo(correo);
        if (adminOptional.isPresent()) {
            System.out.println("Usuario encontrado como Administrador.");
            return adminOptional.get();
        }

        Optional<Deportista> deportistaOptional = deportistaRepository.findByCorreo(correo);
        if (deportistaOptional.isPresent()) {
            Deportista deportista = deportistaOptional.get();
            System.out.println("Usuario encontrado como Deportista. ID: " + deportista.getId() + ", Correo: " + deportista.getCorreo());
            return deportista;
        }

        Optional<Entrenador> entrenadorOptional = entrenadorRepository.findByCorreo(correo);
        if (entrenadorOptional.isPresent()) {
            Entrenador entrenador = entrenadorOptional.get();
            System.out.println("Usuario encontrado como Entrenador. ID: " + entrenador.getId() + ", Correo: " + entrenador.getCorreo());
            return entrenador;
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + correo);
    }
}