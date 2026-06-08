package com.api.booke.domain.universidadeusuario.dto;

public class UniversidadeUsuarioFullResponseDto {

    private Long iduniversidadeusuario;

    private Long iduni;
    private String nome_universidade;

    private Long idcurso;
    private String nome_curso;

    private Long iduser;
    private String nickname_usuario;

    public UniversidadeUsuarioFullResponseDto(Long iduniversidadeusuario,
                                              Long iduni, String nome_universidade,
                                              Long idcurso, String nome_curso,
                                              Long iduser, String nickname_usuario) {
        this.iduniversidadeusuario = iduniversidadeusuario;
        this.iduni = iduni;
        this.nome_universidade = nome_universidade;
        this.idcurso = idcurso;
        this.nome_curso = nome_curso;
        this.iduser = iduser;
        this.nickname_usuario = nickname_usuario;
    }

    // getters
    public Long getId_universidade_usuario() { return iduniversidadeusuario; }
    public Long getId_uni() { return iduni; }
    public String getNome_universidade() { return nome_universidade; }
    public Long getId_curso() { return idcurso; }
    public String getNome_curso() { return nome_curso; }
    public Long getId_user() { return iduser; }
    public String getNickname_usuario() { return nickname_usuario; }
}
