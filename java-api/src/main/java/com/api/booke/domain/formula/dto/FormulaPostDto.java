package com.api.booke.domain.formula.dto;

import lombok.*;

/*
 * DTO usado para criar fórmulas
 */

 @Data
 @NoArgsConstructor
 @AllArgsConstructor

public class FormulaPostDto {
    private String expressao;
    private Long idmateria;
}
