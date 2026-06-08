package com.api.booke.domain.materia.dto;

import java.util.List;

import com.api.booke.domain.notadesempenho.dto.NotaDesempenhoResponseDto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaFullResponseDto {

    private Long idmateria;
    private int semestre_materia;
    private String nomemateria;

    private Long iduniversidadeusuario;

    private Long iduni;
    private String nomeuniversidade;

    private Long idcurso;
    private String nomecurso;

    private Long iduser;
    private String nicknameusuario;

}