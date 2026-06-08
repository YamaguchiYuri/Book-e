package com.api.booke.domain.anotacoes.dto;
import lombok.*; 

/**
 * DTO usado para criação de anotações
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnotacaoPostDto {
    private String titulo;
    private String texto;
    private Long iduser;     // Para vincular ao Usuario
    private Long idmateria;  // Para vincular à Materia
}

