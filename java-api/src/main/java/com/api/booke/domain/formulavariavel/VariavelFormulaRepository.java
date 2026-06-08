package com.api.booke.domain.formulavariavel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.booke.entitites.VariavelFormula;

public interface VariavelFormulaRepository extends JpaRepository<VariavelFormula, Long> {
    
    List<VariavelFormula> findByFormulaIdformula(Long idformula);
    void deleteAllByFormulaIdformula(Long idformula);

}
