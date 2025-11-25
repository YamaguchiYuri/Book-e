package com.api.booke.domain.agenda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/*
 * DTO de saída para retornar agendas na API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendaResponseDto {
    private Long idagenda;
    private Long iduser;
    private String tipo;
    private LocalDate data;
}
