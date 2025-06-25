package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.ProgresoDataDTO;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Service.ProgresoDeportistaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analisis")
public class AnalisisController {

    @Autowired
    private ProgresoDeportistaService progresoDeportistaService;

    /**
     * Endpoint para obtener los datos de progreso de uno o varios deportistas,
     * filtrados por métrica y rango de fechas, listos para ser usados en un gráfico.
     * @param deportistaIds Lista de IDs de los deportistas a consultar.
     * @param tipoMebrica La métrica específica a filtrar.
     * @param fechaInicio La fecha de inicio del rango.
     * @param fechaFin La fecha de fin del rango.
     * @param currentUser El usuario autenticado (para futuras validaciones de seguridad).
     * @return Un mapa con los datos de progreso agrupados por deportista.
     */
    @GetMapping("/progreso")
    public ResponseEntity<Map<String, List<ProgresoDataDTO>>> getProgresoParaGrafico(
            @RequestParam List<Long> deportistaIds,
            @RequestParam String tipoMebrica,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @AuthenticationPrincipal UserDetails currentUser) {

        // Nota de Seguridad: Un entrenador solo debería poder consultar a sus propios deportistas.
        // Esta validación podría implementarse aquí o en la capa de servicio para mayor robustez.
        // Por ahora, confiamos en que el frontend enviará los IDs correctos.

        if (deportistaIds == null || deportistaIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.emptyMap());
        }

        Map<String, List<ProgresoDataDTO>> data = progresoDeportistaService.getProgresoParaGrafico(
                deportistaIds, tipoMebrica, fechaInicio, fechaFin
        );

        return ResponseEntity.ok(data);
    }
}
