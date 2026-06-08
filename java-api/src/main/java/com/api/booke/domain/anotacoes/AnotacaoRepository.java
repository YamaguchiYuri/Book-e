package com.api.booke.domain.anotacoes;

import org.springframework.data.jpa.repository.JpaRepository;
import com.api.booke.entitites.Anotacao;

import java.util.List;

public interface AnotacaoRepository extends JpaRepository<Anotacao, Long> {
    
    // Método extra: Muito útil para carregar as anotações na tela inicial do app
    List<Anotacao> findByUsuario_Iduser(Long idUser);
}