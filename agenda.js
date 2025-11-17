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
        id_user: currentUserId,
        tipo: type,
        data: date
    };
    const response = await fetch('http://localhost:8081/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Erro ao criar agenda');
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

    listArea.innerHTML = '';

    if (events.length === 0) {
      listArea.innerHTML = '<p style="color:white; text-align:center; top:10%">Nenhum compromisso.</p>';
      return; 
    }

 
        events.sort((a, b) => new Date(a.data) - new Date(b.data));

        events.forEach(event => {
          const eventId = event.id ?? event.id_agenda; 
          if (!eventId) return; 
        
          const itemHTML = `
            <div class="agenda-item" data-event-id="${eventId}">
              <div class="agenda-item-details">
                <span><strong>Tipo:</strong> ${event.tipo}</span>
                <span><strong>Data:</strong> ${formatDate(event.data)}</span>
              </div>
              <span class="agenda-item-delete" data-event-id="${eventId}">X</span>
            </div>
          `;
          listArea.innerHTML += itemHTML;
        });
        

    listArea.querySelectorAll('.agenda-item-delete').forEach(button => {
      button.addEventListener('click', handleDeleteEvent);
    });
  } catch (err) {
    console.error(err);
    listArea.innerHTML = '<p style="color:red">Erro ao carregar agenda.</p>';
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
    const id = Number(idStr); // converte para número

    if (!id) {
        console.error('ID do evento inválido:', idStr);
        return;
    }

    try {
        await deleteAgenda(id);
        await renderAgenda();
    } catch (err) {
        console.error(err);
        alert('Erro ao deletar agenda.');
    }
}




export function initAgenda(userId, updateWidgetCallback) {
    currentUserId = userId;
    _updateWidgetCallback = updateWidgetCallback; // Salva a função

    addEventButton.addEventListener('click', handleAddEvent);

    renderAgenda(); // Chama pela primeira vez
}
