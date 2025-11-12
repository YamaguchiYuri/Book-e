package com.api.booke.domain.usuario;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.booke.entitites.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

}
