package com.api.booke.domain.formula;

import lombok.RequiredArgsConstructor;
import org.mariuszgromada.math.mxparser.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.booke.domain.formula.dto.*;
import com.api.booke.domain.materia.MateriaRepository;
import com.api.booke.domain.formulavariavel.VariavelFormulaRepository;
import com.api.booke.entitites.Formula;
import com.api.booke.entitites.Materia;
import com.api.booke.entitites.VariavelFormula;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormulaService {

    private final FormulaRepository formulaRepository;
    private final MateriaRepository materiaRepository;
    private final VariavelFormulaRepository variavelFormulaRepository;

    // -----------------------------------
    // 1. Criar fórmula da matéria
    // -----------------------------------
    @Transactional
    public FormulaResponseDto create(FormulaPostDto dto) {
        Materia materia = materiaRepository.findById(dto.getIdmateria())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        Formula formula = new Formula();
        formula.setExpressao(dto.getExpressao());
        formula.setMateria(materia);
        formulaRepository.save(formula);

        // Extrair variáveis com mXparser
        Set<String> variaveis = extrairVariaveis(dto.getExpressao());

        // Criar variáveis ligadas a esta fórmula
        for (String var : variaveis) {
            VariavelFormula vf = new VariavelFormula();
            vf.setNome(var);
            vf.setFormula(formula);
            variavelFormulaRepository.save(vf);
        }

        return toDto(formula);
    }

    // -----------------------------------
    // 2. Atualizar fórmula e suas variáveis
    // -----------------------------------
    @Transactional
    public FormulaResponseDto update(Long id, FormulaPutDto dto) {
        Formula formula = formulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fórmula não encontrada"));

        formula.setExpressao(dto.getExpressao());
        formulaRepository.save(formula);

        Set<String> novasVars = extrairVariaveis(dto.getExpressao());

        // Deletar variáveis antigas
        variavelFormulaRepository.deleteAllByFormulaIdformula(id);

        // Criar novas variáveis
        for (String var : novasVars) {
            VariavelFormula vf = new VariavelFormula();
            vf.setNome(var);
            vf.setFormula(formula);
            variavelFormulaRepository.save(vf);
        }

        return toDto(formula);
    }

    // -----------------------------------
    // 3. Buscar fórmula por ID
    // -----------------------------------
    public FormulaResponseDto search(Long id) {
        Formula f = formulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fórmula não encontrada"));
        return toDto(f);
    }

    // -----------------------------------
    // 4. Listar todas
    // -----------------------------------
    public List<FormulaResponseDto> listAll() {
        return formulaRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // -----------------------------------
    // 5. Listar por matéria
    // -----------------------------------
    public List<FormulaResponseDto> listByMateria(Long idMateria) {
        return formulaRepository.findByMateriaIdmateria(idMateria)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // -----------------------------------
    // 6. Deletar fórmula
    // -----------------------------------
    @Transactional
    public void delete(Long id) {
        if (!formulaRepository.existsById(id)) {
            throw new RuntimeException("Fórmula não encontrada");
        }

        // Deletar variáveis primeiro
        variavelFormulaRepository.deleteAllByFormulaIdformula(id);

        // Deletar fórmula
        formulaRepository.deleteById(id);
    }

    // -----------------------------------
    // Conversão para DTO
    // -----------------------------------
    private FormulaResponseDto toDto(Formula f) {
        return new FormulaResponseDto(
                f.getIdformula(),
                f.getExpressao(),
                f.getMateria().getIdmateria(),
                f.getMateria().getNomemateria()
        );
    }

    // -----------------------------------
    // Extração dinâmica de variáveis usando mXparser
    // -----------------------------------
   private Set<String> extrairVariaveis(String expressao) {
    Set<String> vars = new HashSet<>();

    // Cria expressão mXparser
    Expression e = new Expression(expressao);

    // Pega tokens desconhecidos (que não são números nem funções internas)
    for (String var : e.getMissingUserDefinedArguments()) {
        vars.add(var);
    }

    // Para garantir, também podemos separar por caracteres não alfanuméricos e adicionar tokens que pareçam variáveis
    String[] tokens = expressao.split("[^a-zA-Z0-9_]+");
    for (String token : tokens) {
        if (!token.isBlank() && !Character.isDigit(token.charAt(0))) {
            vars.add(token);
        }
    }

    return vars;
}
}