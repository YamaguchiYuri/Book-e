package com.api.booke.domain.agenda.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * DTO de saída para retornar agendas na API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AgendaPutDto {
    private Long idagenda;
    private Long iduser;
    private String tipo;
    private LocalDate data;
}
