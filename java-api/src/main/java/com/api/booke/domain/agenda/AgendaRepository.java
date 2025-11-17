package com.api.booke.domain.agenda;

import com.api.booke.entitites.Agenda;
import com.api.booke.entitites.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendaRepository extends JpaRepository<Agenda, Long> {
    List<Agenda> findByUsuario(Usuario usuario);
}
