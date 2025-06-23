package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.EventoRequestDTO;
import com.ipdsystem.sistemaipd.Entity.Evento;
import com.ipdsystem.sistemaipd.Repository.EventoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Transactional(readOnly = true)
    public List<Evento> obtenerTodos() {
        return eventoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Evento> obtenerPorId(Long id) {
        return eventoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Evento> getEventosPorDisciplina(String disciplina) {
        return eventoRepository.findByDisciplinaIgnoreCase(disciplina);
    }

    @Transactional
    public Evento crearEvento(EventoRequestDTO eventoDTO) {
        Evento nuevoEvento = new Evento();
        nuevoEvento.setTitle(eventoDTO.getTitle());
        nuevoEvento.setStart(eventoDTO.getStart());
        nuevoEvento.setEnd(eventoDTO.getEnd());
        nuevoEvento.setDisciplina(eventoDTO.getDisciplina());
        return eventoRepository.save(nuevoEvento);
    }

    @Transactional
    public Evento actualizarEvento(Long id, EventoRequestDTO eventoDTO) {
        return eventoRepository.findById(id).map(evento -> {
            evento.setTitle(eventoDTO.getTitle());
            evento.setStart(eventoDTO.getStart());
            evento.setEnd(eventoDTO.getEnd());
            evento.setDisciplina(eventoDTO.getDisciplina());
            return eventoRepository.save(evento);
        }).orElseThrow(() -> new EntityNotFoundException("Evento no encontrado con ID: " + id));
    }

    public void eliminarEvento(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new EntityNotFoundException("Evento no encontrado con ID: " + id);
        }
        eventoRepository.deleteById(id);
    }
}