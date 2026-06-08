
package com.api.booke.domain.faltas.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaltasPostDto {
    private Long idmateria;
    private int numfaltas;
    private Integer limitefaltas; // Opcional: pode vir nulo na requisição JSON
}