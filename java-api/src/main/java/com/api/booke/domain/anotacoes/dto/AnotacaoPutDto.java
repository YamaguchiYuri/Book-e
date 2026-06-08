package com.api.booke.domain.anotacoes.dto;

import lombok.*;

/**
 * DTO usado para atualização de anotações
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnotacaoPutDto {
    private Long id;         // ID da anotação que será atualizada
    private String titulo;
    private String texto;
    private Long idmateria;
}