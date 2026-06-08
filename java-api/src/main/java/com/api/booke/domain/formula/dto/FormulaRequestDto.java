package com.api.booke.domain.formula.dto;


import lombok.Data;
/*Para requisição */
@Data
public class FormulaRequestDto {

    private String expressao;
    private Long idmateria;
}