package com.api.booke.domain.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.booke.domain.usuario.dto.UsuarioDTO;
import com.api.booke.entitites.Usuario;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private UsuarioDTO toResponseUsuarioDTO (Usuario usuario){
        if(usuario == null) return null;
        return new UsuarioDTO(
            usuario.getId_user(),
            usuario.getNickname_user(),
            usuario.getEmail(),
            usuario.getDt_nasciment_em(),
            usuario.getData_criado_em()
        );
    }

    
}

/*
 *     public ClienteResponseDto createCliente(ClientePostDto dto) {
        if (dto.getEndereco() == null) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }

        Cliente cliente = new Cliente();
        cliente.setCpf_cnpj(dto.getCpf_cnpj());
        cliente.setTipo(dto.getTipo());
        cliente.setNome(dto.getNome());
        cliente.setNome_fantasia(dto.getNome_fantasia());
        cliente.setData_abertura_nascimento(dto.getData_abertura_nascimento());
        cliente.setHomepage(dto.getHomepage());
        cliente.setEmail(dto.getEmail());
        cliente.setNome_contato(dto.getNome_contato());
        cliente.setContato(dto.getContato());
        cliente.setEndereco(toEntity(dto.getEndereco()));

        return toResponseDto(clienteRepository.save(cliente));
    }

    public ClienteResponseDto alterarCliente(Long id, ClientePutDto dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));

        if (dto.getEndereco() == null) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }

        cliente.setCpf_cnpj(dto.getCpf_cnpj());
        cliente.setTipo(dto.getTipo());
        cliente.setNome(dto.getNome());
        cliente.setNome_fantasia(dto.getNome_fantasia());
        cliente.setData_abertura_nascimento(dto.getData_abertura_nascimento());
        cliente.setHomepage(dto.getHomepage());
        cliente.setEmail(dto.getEmail());
        cliente.setNome_contato(dto.getNome_contato());
        cliente.setContato(dto.getContato());
        cliente.setEndereco(toEntity(dto.getEndereco()));

        return toResponseDto(clienteRepository.save(cliente));
    }

    public String deletarCliente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente", "id", id);
        }
        clienteRepository.deleteById(id);
        return "Cliente Deletado";
    }

        public List<ClienteResponseDto> listarClientes() {
        return clienteRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }
 */