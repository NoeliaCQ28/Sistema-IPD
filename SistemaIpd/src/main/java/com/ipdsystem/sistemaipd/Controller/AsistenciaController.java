package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.AsistenciaRequestDTO;
import com.ipdsystem.sistemaipd.Dto.AsistenciaResponseDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    /**
     * Endpoint para que un entrenador obtenga la lista de asistencia de sus deportistas
     * para una fecha específica.
     *
     * @param entrenadorId El ID del entrenador.
     * @param fecha La fecha para la cual se solicita la lista de asistencia.
     * @param currentUser El usuario autenticado (para validación de seguridad).
     * @return Una lista de DTOs de asistencia.
     */
    @GetMapping("/entrenador/{entrenadorId}")
    public ResponseEntity<List<AsistenciaResponseDTO>> getAsistenciasParaFecha(
            @PathVariable Long entrenadorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (!(currentUser instanceof Entrenador) || !((Entrenador) currentUser).getId().equals(entrenadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<AsistenciaResponseDTO> asistencias = asistenciaService.getOrCreateAsistenciasParaFecha(entrenadorId, fecha);
        return ResponseEntity.ok(asistencias);
    }

    /**
     * Endpoint para que un entrenador guarde la lista de asistencia del día.
     *
     * @param entrenadorId El ID del entrenador que guarda la asistencia.
     * @param asistenciasDTO La lista de objetos de asistencia a guardar.
     * @param currentUser El usuario autenticado.
     * @return Una respuesta HTTP 200 OK si el proceso es exitoso.
     */
    @PostMapping("/entrenador/{entrenadorId}")
    public ResponseEntity<Void> registrarAsistencias(
            @PathVariable Long entrenadorId,
            @RequestBody List<AsistenciaRequestDTO> asistenciasDTO,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (!(currentUser instanceof Entrenador) || !((Entrenador) currentUser).getId().equals(entrenadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            asistenciaService.registrarOActualizarAsistencias(entrenadorId, asistenciasDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Considerar un manejo de errores más específico si es necesario
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint para obtener el historial de asistencias de un deportista específico.
     *
     * @param deportistaId El ID del deportista cuyo historial se quiere consultar.
     * @param currentUser El usuario autenticado.
     * @return El historial de asistencias del deportista.
     */
    @GetMapping("/deportista/{deportistaId}")
    public ResponseEntity<List<AsistenciaResponseDTO>> getHistorialDeportista(@PathVariable Long deportistaId, @AuthenticationPrincipal UserDetails currentUser) {
        // Lógica de seguridad:
        // 1. Un deportista solo puede ver su propio historial.
        // 2. Un entrenador puede ver el historial de sus deportistas (se valida en el servicio).
        // 3. Un admin puede ver cualquier historial.
        if (currentUser instanceof Deportista) {
            if (!((Deportista) currentUser).getId().equals(deportistaId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        List<AsistenciaResponseDTO> historial = asistenciaService.getHistorialDeAsistenciasPorDeportista(deportistaId);
        return ResponseEntity.ok(historial);
    }
}
