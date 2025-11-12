package com.api.booke.domain.universidade;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.booke.entitites.Universidade;

public interface UniversidadeRepository extends JpaRepository<Universidade, Long> {
    
    @Query("SELECT u FROM Universidade u WHERE u.uni_nome = :uni_nome")
    Optional<Universidade> findByUni_nome(@Param("uni_nome") String uni_nome);
}

