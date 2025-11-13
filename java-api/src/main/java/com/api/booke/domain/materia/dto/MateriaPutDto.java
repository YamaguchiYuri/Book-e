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
    private Long id_materia;
    private int semestre_materia;
    private String nome_materia;
    private Long id_universidade_usuario;
 }