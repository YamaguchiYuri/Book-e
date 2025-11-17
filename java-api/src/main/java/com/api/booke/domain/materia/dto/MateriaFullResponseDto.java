package com.api.booke.domain.materia.dto;

import java.util.List;

import com.api.booke.domain.notadesempenho.dto.NotaDesempenhoResponseDto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaFullResponseDto {

    private Long id_materia;
    private int semestre_materia;
    private String nome_materia;

    private Long id_universidade_usuario;

    private Long id_uni;
    private String nome_universidade;

    private Long id_curso;
    private String nome_curso;

    private Long id_user;
    private String nickname_usuario;

}