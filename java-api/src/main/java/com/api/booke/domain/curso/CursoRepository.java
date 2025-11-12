package com.api.booke.domain.curso;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.booke.entitites.Curso;

public interface CursoRepository extends JpaRepository<Curso, Long> {
@Query("SELECT c FROM Curso c WHERE c.nome_curso = :nomeCurso AND c.semestre = :semestre")
Optional<Curso> findByNomeCursoAndSemestre(@Param("nomeCurso") String nomeCurso,
                                           @Param("semestre") Integer semestre);

}
