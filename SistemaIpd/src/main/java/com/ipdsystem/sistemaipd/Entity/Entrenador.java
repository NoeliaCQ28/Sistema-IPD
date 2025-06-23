package com.ipdsystem.sistemaipd.Entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Entrenador implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombres;
    private String apellidos;
    @Column(unique = true)
    private String dni;
    private LocalDate fechaNacimiento;
    @Column(unique = true)
    private String correo;
    private String telefono;
    private String disciplinaQueEntrena;
    private String profesion;
    private String especialidad;
    private LocalDateTime fechaContratacion;
    private boolean activo = true;

    @JsonIgnore
    private String password;

    private String rol = "ENTRENADOR";

    @OneToMany(mappedBy = "entrenador", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference("entrenador-deportista")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Deportista> deportistasACargo = new HashSet<>();

    @OneToMany(mappedBy = "entrenador", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("entrenador-horarios")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<HorarioEntrenamiento> horariosCreados = new HashSet<>();

    @OneToMany(mappedBy = "entrenador", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("entrenador-progreso")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<ProgresoDeportista> progresosRegistrados = new HashSet<>();

    // NOTA: No incluimos @OneToMany para Mensaje aquí. Mensaje maneja remitente/receptor por ID y Rol.


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.rol));
    }

    @Override
    public String getUsername() {
        return this.correo;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return this.activo; }
}