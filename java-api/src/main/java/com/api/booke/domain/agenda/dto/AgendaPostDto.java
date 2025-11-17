package com.api.booke.domain.agenda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/*
 * DTO de entrada para criar agendas na API.
 * Representa os dados enviados sem expor a entidade JPA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendaPostDto {
    private Long id_user; // id do usuário
    private String tipo;
    private LocalDate data;
}
