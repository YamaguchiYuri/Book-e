package com.api.booke.domain.notadesempenho;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.booke.entitites.Materia;
import com.api.booke.entitites.NotaDesempenho;

public interface NotaDesempenhoRepository extends JpaRepository<NotaDesempenho, Long> {
    List<NotaDesempenho> findByMateria(Materia materia);

    Optional<NotaDesempenho> findByVariavelIdvariavelAndMateriaIdmateria(Long idVariavel, Long idMateria);

}
