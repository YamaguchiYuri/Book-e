package com.api.booke.domain.materia.dto;

import lombok.*;

/*
 * DTO usado para alterar dados da entidade de Materia
 * 
 */

 @Data
 @NoArgsConstructor
 @AllArgsConstructor

 public class MateriaPutDto{
    private Long idmateria;
    private int semestremateria;
    private String nomemateria;
    private Long iduniversidadeusuario;
 }