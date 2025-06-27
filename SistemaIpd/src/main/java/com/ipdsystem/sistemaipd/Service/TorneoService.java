package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.TorneoRequestDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Torneo;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.TorneoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TorneoService {

    private final TorneoRepository torneoRepository;
    private final DeportistaRepository deportistaRepository; // <-- DEPENDENCIA AÑADIDA

    @Autowired
    public TorneoService(TorneoRepository torneoRepository, DeportistaRepository deportistaRepository) {
        this.torneoRepository = torneoRepository;
        this.deportistaRepository = deportistaRepository; // <-- INYECCIÓN DE DEPENDENCIA
    }

    @Transactional(readOnly = true)
    public List<Torneo> obtenerTodos() {
        return torneoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Torneo> obtenerPorId(Long id) {
        return torneoRepository.findById(id);
    }

    @Transactional
    public Torneo crearTorneo(TorneoRequestDTO torneoDTO) {
        Torneo nuevoTorneo = new Torneo();
        mapDtoToEntity(torneoDTO, nuevoTorneo);
        return torneoRepository.save(nuevoTorneo);
    }

    @Transactional
    public Torneo actualizarTorneo(Long id, TorneoRequestDTO torneoDTO) {
        Torneo torneoExistente = torneoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Torneo no encontrado con ID: " + id));
        mapDtoToEntity(torneoDTO, torneoExistente);
        return torneoRepository.save(torneoExistente);
    }

    @Transactional
    public void eliminarTorneo(Long id) {
        if (!torneoRepository.existsById(id)) {
            throw new EntityNotFoundException("Torneo no encontrado con ID: " + id);
        }
        torneoRepository.deleteById(id);
    }

    // --- NUEVO MÉTODO PARA INSCRIBIR A UN DEPORTISTA ---
    @Transactional
    public void inscribirDeportista(Long torneoId, Long deportistaId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new EntityNotFoundException("Torneo no encontrado con ID: " + torneoId));
        Deportista deportista = deportistaRepository.findById(deportistaId)
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + deportistaId));

        // Añadimos el torneo a la lista de inscripciones del deportista
        deportista.getTorneosInscritos().add(torneo);
        deportistaRepository.save(deportista); // Guardamos la entidad dueña de la relación
    }

    // --- NUEVO MÉTODO PARA ANULAR UNA INSCRIPCIÓN ---
    @Transactional
    public void anularInscripcion(Long torneoId, Long deportistaId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new EntityNotFoundException("Torneo no encontrado con ID: " + torneoId));
        Deportista deportista = deportistaRepository.findById(deportistaId)
                .orElseThrow(() -> new EntityNotFoundException("Deportista no encontrado con ID: " + deportistaId));

        // Removemos el torneo de la lista de inscripciones del deportista
        deportista.getTorneosInscritos().remove(torneo);
        deportistaRepository.save(deportista);
    }

    private void mapDtoToEntity(TorneoRequestDTO dto, Torneo entity) {
        entity.setNombre(dto.getNombre());
        entity.setLugar(dto.getLugar());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setCategoria(dto.getCategoria());
        entity.setDescripcion(dto.getDescripcion());
    }
}
