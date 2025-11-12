package com.api.booke.domain.universidade.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
 
/*
 * DTO de post (criar) para retornar universidades na API.
 * Representa os dados expostos pela API sem expor diretamente a entidade JPA.
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniversidadePostDto {
    private String uni_nome;
}
