package com.api.booke.domain.universidadeusuario.dto;

public class UniversidadeUsuarioFullResponseDto {

    private Long id_universidade_usuario;

    private Long id_uni;
    private String nome_universidade;

    private Long id_curso;
    private String nome_curso;

    private Long id_user;
    private String nickname_usuario;

    public UniversidadeUsuarioFullResponseDto(Long id_universidade_usuario,
                                              Long id_uni, String nome_universidade,
                                              Long id_curso, String nome_curso,
                                              Long id_user, String nickname_usuario) {
        this.id_universidade_usuario = id_universidade_usuario;
        this.id_uni = id_uni;
        this.nome_universidade = nome_universidade;
        this.id_curso = id_curso;
        this.nome_curso = nome_curso;
        this.id_user = id_user;
        this.nickname_usuario = nickname_usuario;
    }

    // getters
    public Long getId_universidade_usuario() { return id_universidade_usuario; }
    public Long getId_uni() { return id_uni; }
    public String getNome_universidade() { return nome_universidade; }
    public Long getId_curso() { return id_curso; }
    public String getNome_curso() { return nome_curso; }
    public Long getId_user() { return id_user; }
    public String getNickname_usuario() { return nickname_usuario; }
}
