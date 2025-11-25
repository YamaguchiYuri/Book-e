package com.api.booke.domain.calcular.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalculoResponseDto {
    private Long idFormula;
    private Long idMateria;
    private double resultado;
}

