package com.api.booke.domain.formularioinicial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class FormularioInicialResponseDto {

    private Long iduni;
    private Long idcurso;
    private Long iduniversidadeusuario;
    private List<Long> idmateria;
}
