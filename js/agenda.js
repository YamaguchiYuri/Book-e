//foi modificado e algumas coisas do widget agenda estao aqui pra ele nao renderizar 100% la
const listArea = document.getElementById('lista-agenda');
const eventTypeInput = document.getElementById('add-tipo');
const eventDateInput = document.getElementById('add-data');
const addEventButton = document.getElementById('btnAdd-agenda');

let currentUserId = null;


let _updateWidgetCallback = () => {};


async function fetchAgendas() {
    try {
        const response = await fetch(`http://localhost:8081/api/agenda/usuario/${currentUserId}`, {
                cache: 'no-store'
            });
        // Se o usuário não tiver agendas, retorna array vazio
        if (response.status === 404) {
            return [];
        }

        if (!response.ok) {
            console.error('Erro ao buscar agendas:', response.statusText);
            return [];
        }

        return await response.json(); // retorna array de AgendaResponseDto
    } catch (err) {
        console.error('Erro ao buscar agendas:', err);
        return []; // garante que não quebre a renderização
    }
}

async function createAgenda(type, date) {
    const body = {
        iduser: Number(currentUserId), // Provável correção: sem underline e convertido para Número
        tipo: type,
        data: date
    };
    
    // Verifique se a sua rota é essa mesma ou se termina com /criar
    const response = await fetch('http://localhost:8081/api/agenda', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        // Agora vamos capturar a mensagem real de erro que o Java manda!
        const errorText = await response.text();
        throw new Error(`Java retornou erro: ${errorText || response.statusText}`);
    }
    
    return response.json();
}

async function deleteAgenda(id) {
    const response = await fetch(`http://localhost:8081/api/agenda/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao deletar agenda');
}


async function renderAgenda() {
    try {
        const events = await fetchAgendas(); 
        _updateWidgetCallback(events); 

        if (!events || events.length === 0) {
            return; 
        }

        events.sort((a, b) => new Date(a.data) - new Date(b.data));

        // Construir todo o HTML primeiro é mais seguro e evita bugs nos botões
        let htmlString = '';

        events.forEach(event => {
            // Cobre as 3 formas mais comuns do Java retornar esse ID
            const eventId = event.id || event.idagenda || event.id_agenda; 
            
            if (!eventId) {
                console.warn("Evento sem ID ignorado:", event);
                return; 
            }
        
            htmlString += `
                <div class="agenda-item" data-event-id="${eventId}">
                    <div class="agenda-item-details">
                        <span><strong>Tipo:</strong> ${event.tipo}</span>
                        <span><strong>Data:</strong> ${formatDate(event.data)}</span>
                    </div>
                    <span class="agenda-item-delete delete-nota-btn" data-event-id="${eventId}">[X]</span>
                </div>
            `;
        });
        
        // Injeta tudo de uma vez
        listArea.innerHTML = htmlString;

        // Adiciona os ouvintes de exclusão APÓS os elementos estarem na tela
        listArea.querySelectorAll('.agenda-item-delete').forEach(button => {
            button.addEventListener('click', handleDeleteEvent);
        });

    } catch (err) {
        console.error(err);
        listArea.innerHTML = '<p style="color:red; text-align:center; font-size:10px;">Erro ao carregar agenda.</p>';
    }
}
function formatDate(dateString) {
  if (!dateString) return 'Data indefinida';
    // Adiciona T12:00:00 para corrigir bugs de fuso horário
  const date = new Date(dateString + 'T12:00:00'); 
  return date.toLocaleDateString('pt-BR'); // Formata para DD/MM/AAAA
}
//handles de controle
async function handleAddEvent() {
    const type = eventTypeInput.value;
    const date = eventDateInput.value;

    if (!type || !date) {
        alert('Preencha tipo e data.');
        return;
    }

    try {
            await createAgenda(type, date);
            eventTypeInput.value = '';
            eventDateInput.value = '';
            
            await renderAgenda();
    } catch (err) {
        console.error(err);
        alert('Erro ao adicionar agenda.');
    }
}

async function handleDeleteEvent(e) {
    const idStr = e.target.dataset.eventId;
    const id = Number(idStr); 

    if (!id) {
        console.error('ID do evento inválido:', idStr);
        return;
    }

    // Adiciona uma confirmação para o usuário não apagar sem querer
    if (!confirm('Deseja excluir este compromisso?')) {
        return;
    }

    try {
        // Usa o botão para mostrar que está carregando (opcional, mas bom feedback)
        e.target.innerText = '...'; 
        
        await deleteAgenda(id);
        await renderAgenda(); // Recarrega a lista atualizada
    } catch (err) {
        console.error(err);
        alert('Erro ao deletar agenda.');
        e.target.innerText = '[X]'; // Volta ao normal se der erro
    }
}




export function initAgenda(userId, updateWidgetCallback) {
    currentUserId = userId;
    _updateWidgetCallback = updateWidgetCallback; // Salva a função

    addEventButton.addEventListener('click', handleAddEvent);

    renderAgenda(); // Chama pela primeira vez
}
