package com.api.booke.controller;

import com.api.booke.domain.agenda.AgendaService;
import com.api.booke.domain.agenda.dto.AgendaPostDto;
import com.api.booke.domain.agenda.dto.AgendaResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/agenda")
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    /* Criar agenda */
    @PostMapping
    public AgendaResponseDto criarAgenda(@RequestBody AgendaPostDto dto) {
        return agendaService.createAgenda(dto);
    }

    /* Alterar agenda */
    @PutMapping("/{id}")
    public AgendaResponseDto alterarAgenda(@PathVariable Long id, @RequestBody AgendaPostDto dto) {
        return agendaService.alterarAgenda(id, dto);
    }

    /* Deletar agenda */
    @DeleteMapping("/{id}")
    public String deletarAgenda(@PathVariable Long id) {
        return agendaService.deletarAgenda(id);
    }

    /* Listar todas as agendas */
    @GetMapping
    public List<AgendaResponseDto> listarAgendas() {
        return agendaService.listarAgendas();
    }

    /* Listar agendas por usuário */
    @GetMapping("/usuario/{idUser}")
    public List<AgendaResponseDto> listarAgendasPorUsuario(@PathVariable Long idUser) {
        return agendaService.listarAgendasPorUsuario(idUser);
    }
}
