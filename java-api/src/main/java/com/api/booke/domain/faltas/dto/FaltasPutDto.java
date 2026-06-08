
package com.api.booke.domain.faltas.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaltasPutDto {
    private Long idfaltamateria;
    private int numfaltas;
    private Integer limitefaltas; // Opcional: permite atualizar ou remover o limite
}