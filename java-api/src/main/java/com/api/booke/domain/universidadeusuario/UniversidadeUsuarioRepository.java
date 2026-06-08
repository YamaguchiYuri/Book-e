package com.api.booke.domain.universidadeusuario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

import com.api.booke.entitites.UniversidadeUsuario;

public interface UniversidadeUsuarioRepository extends JpaRepository<UniversidadeUsuario, Long>{
    List<UniversidadeUsuario> findByUsuarioIduser(Long iduser);
}

