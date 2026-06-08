package com.api.booke.domain.formula;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.booke.entitites.Formula;
import com.api.booke.entitites.Materia;

public interface FormulaRepository extends JpaRepository<Formula, Long>{
    
    List<Formula> findByMateriaIdmateria(Long idmateria);

    
    void deleteByMateria(Materia materia);
    

}
