package com.api.booke.domain.faltas;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.api.booke.entitites.Faltas;
import com.api.booke.entitites.Materia;

public interface FaltasRepository extends JpaRepository<Faltas, Long> {
    
    List<Faltas> findByMateriaIdmateria(Long idmateria);

    
    void deleteByMateria(Materia materia);

}
