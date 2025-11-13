package com.api.booke.domain.formularioinicial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class FormularioInicialResponseDto {

    private Long id_uni;
    private Long id_curso;
    private Long id_universidade_usuario;
    private List<Long> id_materia;
}
