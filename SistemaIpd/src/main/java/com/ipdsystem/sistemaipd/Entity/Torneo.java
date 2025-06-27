package com.ipdsystem.sistemaipd.Entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Torneo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String categoria;
    private String lugar;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    @Column(length = 500)
    private String descripcion;

    // --- RELACIÓN AÑADIDA ---
    // Un torneo puede tener muchos deportistas inscritos.
    // 'mappedBy' indica que la entidad Deportista es la dueña de la relación.
    @ManyToMany(mappedBy = "torneosInscritos", fetch = FetchType.LAZY)
    @JsonIgnore // Evita bucles infinitos al serializar a JSON
    private Set<Deportista> deportistasInscritos = new HashSet<>();
}
