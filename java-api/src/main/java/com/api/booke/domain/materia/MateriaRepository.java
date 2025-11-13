package com.api.booke.domain.materia;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.booke.entitites.Materia;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
    
}
