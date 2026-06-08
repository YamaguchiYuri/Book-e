package com.api.booke.domain.faltas.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaltasResponseDto {
    private Long idfaltamateria;
    private int numfaltas;
    private Integer limitefaltas;
    private Long idmateria;
}