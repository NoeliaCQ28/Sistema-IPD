package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.AsistenciaStatsDTO;
import com.ipdsystem.sistemaipd.Dto.ProgresoDataDTO;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Service.AsistenciaService;
import com.ipdsystem.sistemaipd.Service.ProgresoDeportistaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analisis")
public class AnalisisController {

    @Autowired
    private ProgresoDeportistaService progresoDeportistaService;

    @Autowired
    private AsistenciaService asistenciaService;

    @GetMapping("/progreso")
    public ResponseEntity<Map<String, List<ProgresoDataDTO>>> getProgresoParaGrafico(
            @RequestParam List<Long> deportistaIds,
            @RequestParam String tipoMebrica,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @AuthenticationPrincipal UserDetails currentUser) {

        Map<String, List<ProgresoDataDTO>> data = progresoDeportistaService.getProgresoParaGrafico(
                deportistaIds, tipoMebrica, fechaInicio, fechaFin
        );
        return ResponseEntity.ok(data);
    }

    /**
     * Endpoint para obtener el reporte de estadísticas de asistencia.
     * @param fechaInicio La fecha de inicio del rango del reporte.
     * @param fechaFin La fecha de fin del rango del reporte.
     * @param currentUser El usuario autenticado (para obtener su ID).
     * @return Una lista con las estadísticas de asistencia de cada deportista.
     */
    @GetMapping("/asistencia/reporte")
    public ResponseEntity<List<AsistenciaStatsDTO>> getReporteAsistencia(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (!(currentUser instanceof Entrenador)) {
            // En un caso real, se podría lanzar una excepción o devolver un error más específico.
            return ResponseEntity.status(403).build();
        }

        Long entrenadorId = ((Entrenador) currentUser).getId();
        List<AsistenciaStatsDTO> reporte = asistenciaService.getReporteAsistencia(entrenadorId, fechaInicio, fechaFin);
        return ResponseEntity.ok(reporte);
    }
}
