package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.MensajeRequestDTO;
import com.ipdsystem.sistemaipd.Dto.MensajeResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.Mensaje;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import com.ipdsystem.sistemaipd.Repository.MensajeRepository;
import com.ipdsystem.sistemaipd.Repository.UnreadMessageCountBySender;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;
    @Autowired
    private DeportistaRepository deportistaRepository;
    @Autowired
    private EntrenadorRepository entrenadorRepository;

    @Transactional
    public MensajeResponseDTO enviarMensaje(MensajeRequestDTO requestDTO) {
        Mensaje mensaje = new Mensaje();
        mensaje.setContenido(requestDTO.getContenido());
        mensaje.setRemitenteId(requestDTO.getRemitenteId());
        mensaje.setRemitenteRol(requestDTO.getRemitenteRol());
        mensaje.setReceptorId(requestDTO.getReceptorId());
        mensaje.setReceptorRol(requestDTO.getReceptorRol());
        mensaje.setLeido(false);

        Mensaje savedMensaje = mensajeRepository.save(mensaje);
        return mapToResponseDTO(savedMensaje);
    }

    @Transactional(readOnly = true)
    public List<MensajeResponseDTO> getConversation(Long user1Id, String user1Rol, Long user2Id, String user2Rol) {
        List<Mensaje> mensajes = mensajeRepository.findConversation(user1Id, user1Rol, user2Id, user2Rol);
        return mensajes.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @Transactional
    public MensajeResponseDTO marcarComoLeido(Long mensajeId) {
        Mensaje mensaje = mensajeRepository.findById(mensajeId)
                .orElseThrow(() -> new EntityNotFoundException("Mensaje no encontrado con ID: " + mensajeId));
        mensaje.setLeido(true);
        Mensaje updatedMensaje = mensajeRepository.save(mensaje);
        return mapToResponseDTO(updatedMensaje);
    }

    @Transactional(readOnly = true)
    public long countUnreadMessagesForUser(Long userId, String userRol) {
        return mensajeRepository.countUnreadMessagesForUser(userId, userRol);
    }

    @Transactional(readOnly = true)
    public Map<Long, Long> getUnreadMessageCountBySender(Long userId, String userRol) {
        List<UnreadMessageCountBySender> counts = mensajeRepository.countUnreadMessagesBySender(userId, userRol);
        return counts.stream()
                .collect(Collectors.toMap(
                        UnreadMessageCountBySender::getRemitenteId,
                        UnreadMessageCountBySender::getCount
                ));
    }

    private MensajeResponseDTO mapToResponseDTO(Mensaje mensaje) {
        MensajeResponseDTO dto = new MensajeResponseDTO();
        dto.setId(mensaje.getId());
        dto.setContenido(mensaje.getContenido());
        dto.setFechaEnvio(mensaje.getFechaEnvio());
        dto.setLeido(mensaje.isLeido());
        dto.setRemitenteId(mensaje.getRemitenteId());
        dto.setRemitenteRol(mensaje.getRemitenteRol());
        dto.setReceptorId(mensaje.getReceptorId());
        dto.setReceptorRol(mensaje.getReceptorRol());

        if ("DEPORTISTA".equals(mensaje.getRemitenteRol())) {
            deportistaRepository.findById(mensaje.getRemitenteId())
                    .ifPresent(d -> dto.setRemitenteNombre(d.getNombres() + " " + d.getApellidos()));
        } else if ("ENTRENADOR".equals(mensaje.getRemitenteRol())) {
            entrenadorRepository.findById(mensaje.getRemitenteId())
                    .ifPresent(e -> dto.setRemitenteNombre(e.getNombres() + " " + e.getApellidos()));
        }

        if ("DEPORTISTA".equals(mensaje.getReceptorRol())) {
            deportistaRepository.findById(mensaje.getReceptorId())
                    .ifPresent(d -> dto.setReceptorNombre(d.getNombres() + " " + d.getApellidos()));
        } else if ("ENTRENADOR".equals(mensaje.getReceptorRol())) {
            entrenadorRepository.findById(mensaje.getReceptorId())
                    .ifPresent(e -> dto.setReceptorNombre(e.getNombres() + " " + e.getApellidos()));
        }

        return dto;
    }
}
