package com.api.booke.domain.formulavariavel;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.booke.domain.formula.FormulaRepository;
import com.api.booke.domain.formulavariavel.dto.*;
import com.api.booke.entitites.Formula;
import com.api.booke.entitites.VariavelFormula;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VariavelFormulaService {

    @Autowired
    private VariavelFormulaRepository variavelFormulaRepository;

    @Autowired
    private FormulaRepository formulaRepository;

    // --------------------
    // Criar variável
    // --------------------
    public VariavelFormulaResponseDto create(VariavelFormulaRequestDto dto) {

        Formula formula = formulaRepository.findById(dto.getIdformula())
                .orElseThrow(() -> new RuntimeException("Fórmula não encontrada!"));

        VariavelFormula variavel = new VariavelFormula();
        variavel.setNome(dto.getNome());
        variavel.setFormula(formula);

        variavel = variavelFormulaRepository.save(variavel);

        return new VariavelFormulaResponseDto(
                variavel.getIdvariavel(),
                variavel.getNome(),
                 variavel.getFormula().getIdformula()
        );
    }

    // --------------------
    // Buscar por ID
    // --------------------
    public VariavelFormulaResponseDto searchForId(Long id) {
        VariavelFormula variavel = variavelFormulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variável não encontrada!"));

        return new VariavelFormulaResponseDto(
                variavel.getIdvariavel(),
                variavel.getNome(),
                variavel.getFormula().getIdformula()
        );
    }

    // --------------------
    // Listar por fórmula
    // --------------------
    public List<VariavelFormulaResponseDto> searchFormula(Long formulaId) {

        Formula formula = formulaRepository.findById(formulaId)
                .orElseThrow(() -> new RuntimeException("Fórmula não encontrada!"));

        return variavelFormulaRepository.findByFormulaIdformula(formulaId)
                .stream()
                .map(v -> new VariavelFormulaResponseDto(
                        v.getIdvariavel(),
                        v.getNome(),
                        v.getFormula().getIdformula()
                ))
                .collect(Collectors.toList());
    }

    // --------------------
    // Deletar variável
    // --------------------
    public void deletar(Long id) {
        if (!variavelFormulaRepository.existsById(id)) {
            throw new RuntimeException("Variável não encontrada!");
        }
        variavelFormulaRepository.deleteById(id);
    }
}
