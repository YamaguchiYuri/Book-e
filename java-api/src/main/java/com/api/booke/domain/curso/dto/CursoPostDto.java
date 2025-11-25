package com.api.booke.domain.curso.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
 
/*
 * DTO de saída para criar cursos na API.
 * Representa os dados expostos pela API sem expor diretamente a entidade JPA.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoPostDto {
    private String nomecurso;
    private Integer semestre;
}
