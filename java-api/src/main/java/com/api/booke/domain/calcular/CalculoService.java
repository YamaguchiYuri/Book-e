package com.api.booke.domain.calcular;

import org.springframework.stereotype.Service;

import com.api.booke.domain.formula.FormulaRepository;
import com.api.booke.domain.formulavariavel.VariavelFormulaRepository;
import com.api.booke.domain.notadesempenho.NotaDesempenhoRepository;
import com.api.booke.entitites.Formula;
import com.api.booke.entitites.VariavelFormula;
import com.api.booke.entitites.NotaDesempenho;

import org.mariuszgromada.math.mxparser.Expression;
import org.mariuszgromada.math.mxparser.Argument;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalculoService {

    private final FormulaRepository formulaRepository;
    private final VariavelFormulaRepository variavelFormulaRepository;
    private final NotaDesempenhoRepository notaDesempenhoRepository;

    /**
     * Calcula o valor de uma fórmula usando os valores de NOTA_DESEMPENHO.
     *
     * @param idFormula ID da fórmula
     * @param idMateria ID da matéria para pegar as notas
     * @return resultado da fórmula
     */
    public double calcular(Long idFormula, Long idMateria) {
        Formula formula = formulaRepository.findById(idFormula)
                .orElseThrow(() -> new RuntimeException("Fórmula não encontrada"));

        // Pega todas as variáveis da fórmula
        List<VariavelFormula> variaveis = variavelFormulaRepository.findByFormulaIdformula(idFormula);

        // Pega os valores de NOTA_DESEMPENHO para a matéria
        Map<String, Double> valores = variaveis.stream()
                .collect(Collectors.toMap(
                        VariavelFormula::getNome,
                        v -> {
                            NotaDesempenho nota = notaDesempenhoRepository
                                    .findByVariavelIdvariavelAndMateriaIdmateria(v.getIdvariavel(), idMateria)
                                    .orElse(null);
                            return nota != null ? (double) nota.getNota_cadastro() : 0.0;
                        }
                ));

        // Cria argumentos mXparser
        Argument[] args = variaveis.stream()
                .map(v -> new Argument(v.getNome(), valores.getOrDefault(v.getNome(), 0.0)))
                .toArray(Argument[]::new);

        // Cria expressão
        Expression e = new Expression(formula.getExpressao(), args);

        // Avalia e retorna
        return e.calculate();
    }
}