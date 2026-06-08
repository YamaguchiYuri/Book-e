
package com.api.booke.domain.anotacoes;

import com.api.booke.domain.anotacoes.dto.*;
import com.api.booke.domain.materia.MateriaRepository;
import com.api.booke.domain.usuario.UsuarioRepository; // Ajuste este import conforme seu pacote
import com.api.booke.entitites.Anotacao;
import com.api.booke.entitites.Materia;
import com.api.booke.entitites.Usuario;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnotacaoService {

    private final AnotacaoRepository anotacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MateriaRepository materiaRepository;

    public AnotacaoService(AnotacaoRepository anotacaoRepository, 
                           UsuarioRepository usuarioRepository, 
                           MateriaRepository materiaRepository) {
        this.anotacaoRepository = anotacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.materiaRepository = materiaRepository;
    }

    // Criar nova anotação
    @Transactional
    public AnotacaoResponseDto create(AnotacaoPostDto dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIduser())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Materia materia = materiaRepository.findById(dto.getIdmateria())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        Anotacao anotacao = new Anotacao();
        anotacao.setTitulo(dto.getTitulo());
        anotacao.setTexto(dto.getTexto());
        anotacao.setUsuario(usuario);
        anotacao.setMateria(materia);

        anotacaoRepository.save(anotacao);
        return toResponse(anotacao);
    }

    // Atualizar anotação existente (Sem alterar o Usuário)
    @Transactional
    public AnotacaoResponseDto update(AnotacaoPutDto dto) {
        Anotacao anotacao = anotacaoRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Anotação não encontrada"));

        Materia materia = materiaRepository.findById(dto.getIdmateria())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        anotacao.setTitulo(dto.getTitulo());
        anotacao.setTexto(dto.getTexto());
        anotacao.setMateria(materia);
        // O usuário não é alterado aqui! Mantemos o dono original da anotação.

        anotacaoRepository.save(anotacao);
        return toResponse(anotacao);
    }

    // Buscar anotação por ID
    public AnotacaoResponseDto getById(Long id) {
        Anotacao anotacao = anotacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anotação não encontrada"));
        return toResponse(anotacao);
    }

    // Listar todas as anotações
    public List<AnotacaoResponseDto> getAll() {
        return anotacaoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Listar anotações de um usuário específico
    public List<AnotacaoResponseDto> getByUserId(Long idUser) {
        return anotacaoRepository.findByUsuario_Iduser(idUser)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Deletar anotação
    @Transactional
    public void delete(Long id) {
        if (!anotacaoRepository.existsById(id)) {
            throw new RuntimeException("Anotação não encontrada");
        }
        anotacaoRepository.deleteById(id);
    }

    // Converter entidade → response
    private AnotacaoResponseDto toResponse(Anotacao anotacao) {
        return new AnotacaoResponseDto(
                anotacao.getId(),
                anotacao.getTitulo(),
                anotacao.getTexto(),
                anotacao.getUsuario().getIduser(), // Supondo que a PK do usuário seja iduser
                anotacao.getMateria().getIdmateria()
        );
    }
}