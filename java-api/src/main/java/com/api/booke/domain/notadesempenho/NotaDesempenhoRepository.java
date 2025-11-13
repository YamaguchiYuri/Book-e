package com.api.booke.domain.notadesempenho;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.booke.entitites.NotaDesempenho;

public interface NotaDesempenhoRepository extends JpaRepository<NotaDesempenho, Long> {
    
}
