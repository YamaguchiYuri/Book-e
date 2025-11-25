package com.api.booke.domain.formula.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormulaResponseDto {
    private Long idformula;
    private String expressao;

    private Long idmateria;
    private String nomemateria;  
}
