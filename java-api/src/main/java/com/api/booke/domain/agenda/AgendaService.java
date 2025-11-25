package com.api.booke.domain.agenda;

import com.api.booke.domain.agenda.dto.AgendaPostDto;
import com.api.booke.domain.agenda.dto.AgendaResponseDto;
import com.api.booke.domain.usuario.UsuarioRepository;
import com.api.booke.entitites.Agenda;
import com.api.booke.entitites.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendaService {

    @Autowired
    private AgendaRepository agendaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; // para buscar usuário pelo id

    // Conversão de entidade para DTO de resposta
    private AgendaResponseDto toResponseDto(Agenda agenda) {
        if (agenda == null) return null;
        return new AgendaResponseDto(
            agenda.getIdagenda(),
            agenda.getUsuario().getIduser(),
            agenda.getTipo(),
            agenda.getData()
        );
    }

    /* Criar agenda */
    public AgendaResponseDto createAgenda(AgendaPostDto dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIduser())
            .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + dto.getIduser() + " não encontrado."));

        Agenda agenda = new Agenda();
        agenda.setUsuario(usuario);
        agenda.setTipo(dto.getTipo());
        agenda.setData(dto.getData());

        return toResponseDto(agendaRepository.save(agenda));
    }

    /* Alterar agenda */
    public AgendaResponseDto alterarAgenda(Long id, AgendaPostDto dto) {
        Agenda agenda = agendaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Agenda com ID " + id + " não encontrada."));

        Usuario usuario = usuarioRepository.findById(dto.getIduser())
            .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + dto.getIduser() + " não encontrado."));

        agenda.setUsuario(usuario);
        agenda.setTipo(dto.getTipo());
        agenda.setData(dto.getData());

        return toResponseDto(agendaRepository.save(agenda));
    }

    /* Deletar agenda */
    public String deletarAgenda(Long id) {
        if (!agendaRepository.existsById(id)) {
            throw new IllegalArgumentException("Agenda com ID " + id + " não encontrada.");
        }
        agendaRepository.deleteById(id);
        return "Agenda deletada com sucesso.";
    }

    /* Listar todas as agendas */
    public List<AgendaResponseDto> listarAgendas() {
        return agendaRepository.findAll()
            .stream()
            .map(this::toResponseDto)
            .collect(Collectors.toList());
    }

    /* Listar agendas por ID do usuário */
public List<AgendaResponseDto> listarAgendasPorUsuario(Long idUser) {
    Usuario usuario = usuarioRepository.findById(idUser)
        .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + idUser + " não encontrado."));

    return agendaRepository.findByUsuario(usuario)
        .stream()
        .map(this::toResponseDto)
        .collect(Collectors.toList());
}



}
