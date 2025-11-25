package com.api.booke.domain.formula.dto;
import lombok.*;

/**
 * DTO usado para alteração de fórmulas
 */


@Data
@NoArgsConstructor
public class FormulaPutDto {
    private String expressao;
    private Long idmateria;
}
