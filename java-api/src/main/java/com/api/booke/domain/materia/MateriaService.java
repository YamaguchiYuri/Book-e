package com.api.booke.domain.materia;

import com.api.booke.domain.materia.dto.*;
import com.api.booke.domain.universidadeusuario.UniversidadeUsuarioRepository;
import com.api.booke.entitites.Materia;
import com.api.booke.entitites.UniversidadeUsuario;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MateriaService {

    private final MateriaRepository materiaRepository;
    private final UniversidadeUsuarioRepository universidadeUsuarioRepository;

    public MateriaService(MateriaRepository materiaRepository, UniversidadeUsuarioRepository universidadeUsuarioRepository) {
        this.materiaRepository = materiaRepository;
        this.universidadeUsuarioRepository = universidadeUsuarioRepository;
    }

    //Criar nova matéria
    @Transactional
    public MateriaResponseDto create(MateriaPostDto dto) {
        UniversidadeUsuario universidadeUsuario = universidadeUsuarioRepository.findById(dto.getIduniversidadeusuario())
                .orElseThrow(() -> new RuntimeException("UniversidadeUsuario não encontrado"));

        Materia materia = new Materia();
        materia.setNomemateria(dto.getNomemateria());
        materia.setSemestre_materia(dto.getSemestremateria());
        materia.setUniversidadeUsuario(universidadeUsuario);

        materiaRepository.save(materia);
        return toResponse(materia);
    }

    //Atualizar matéria existente
    @Transactional
    public MateriaResponseDto update(MateriaPutDto dto) {
        Materia materia = materiaRepository.findById(dto.getIdmateria())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        UniversidadeUsuario universidadeUsuario = universidadeUsuarioRepository.findById(dto.getIduniversidadeusuario())
                .orElseThrow(() -> new RuntimeException("UniversidadeUsuario não encontrado"));

        materia.setNomemateria(dto.getNomemateria());
        materia.setSemestre_materia(dto.getSemestremateria());
        materia.setUniversidadeUsuario(universidadeUsuario);

        materiaRepository.save(materia);
        return toResponse(materia);
    }

    //Buscar matéria por ID
    public MateriaResponseDto getById(Long id) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));
        return toResponse(materia);
    }

    //Listar todas as matérias
    public List<MateriaResponseDto> getAll() {
        return materiaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Listar matérias por universidade-usuario (útil pra exibir as matérias do usuário logado)
    public List<MateriaResponseDto> getByUniversidadeUsuario(Long idUniversidadeUsuario) {
        return materiaRepository.findAll()
                .stream()
                .filter(m -> m.getUniversidadeUsuario().getIduniversidadeusuario().equals(idUniversidadeUsuario))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    //Deletar matéria
    @Transactional
    public void delete(Long id) {
        if (!materiaRepository.existsById(id)) {
            throw new RuntimeException("Matéria não encontrada");
        }
        materiaRepository.deleteById(id);
    }

    // Converter entidade → response
    private MateriaResponseDto toResponse(Materia materia) {
        return new MateriaResponseDto(
                materia.getIdmateria(),
                materia.getSemestre_materia(),
                materia.getNomemateria()
        );
    }

public List<MateriaFullResponseDto> getFullByUserId(Long idUser) {
    return materiaRepository.findAll()
            .stream()
            .filter(m -> m.getUniversidadeUsuario().getUsuario().getIduser().equals(idUser))
            .map(m -> {
                UniversidadeUsuario uu = m.getUniversidadeUsuario();

                return new MateriaFullResponseDto(
                        m.getIdmateria(),
                        m.getSemestre_materia(),
                        m.getNomemateria(),

                        uu.getIduniversidadeusuario(),

                        uu.getUniversidade().getIduni(),
                        uu.getUniversidade().getUninome(),

                        uu.getCurso().getIdcurso(),
                        uu.getCurso().getNomecurso(),

                        uu.getUsuario().getIduser(),
                        uu.getUsuario().getNicknameuser()

                );
            })
            .collect(Collectors.toList());
}

}
