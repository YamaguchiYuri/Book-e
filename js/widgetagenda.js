//foi modificado
let AGENDA_API_ENDPOINT = ''; 
const listaWidget = document.getElementById('agenda-widget-list');

function formatWidgetDate(dateString) {
    if (!dateString) return '??/??';
    const date = new Date(dateString + 'T12:00:00'); 
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}

async function fetchWidgetAgendas() {
    try {
        const response = await fetch(AGENDA_API_ENDPOINT, {
            cache: 'no-store' // Força o navegador a não usar o cache
        });
        if (response.status === 404) {
            return []; // Usuário ainda não tem agendas
        }
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.statusText}`);
        }
        return await response.json();
    } catch (err) {
        console.error("Erro ao buscar dados do widget:", err);
        throw err; // Lança o erro para o renderAgendaWidget tratar
    }
}


export function renderAgendaWidget(events) { 
    if (!listaWidget) return; 

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.data + 'T12:00:00'); 
        return eventDate >= today;
    });
    
    upcomingEvents.sort((a, b) => new Date(a.data) - new Date(b.data));
    const top3Events = upcomingEvents.slice(0, 3);

    listaWidget.innerHTML = ''; 
    if (top3Events.length === 0) {
        listaWidget.innerHTML = '<li style="background:none; box-shadow:none;">Sem eventos futuros.</li>';
        return;
    }

    top3Events.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${formatWidgetDate(event.data)}:</strong> ${event.tipo}`;
        listaWidget.appendChild(li);
    });
}


export async function initAgendaWidget(userId) {
    AGENDA_API_ENDPOINT = `http://localhost:8081/api/agenda/usuario/${userId}`; 

    listaWidget.innerHTML = '<li style="background:none; box-shadow:none;">Carregando...</li>';
    try {

        const response = await fetch(AGENDA_API_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) throw new Error('Falha ao carregar widget');
        const initialEvents = await response.json();
        
        renderAgendaWidget(initialEvents);
    } catch (e) {
        listaWidget.innerHTML = '<li style="background:none; box-shadow:none; color:red;">Erro ao carregar.</li>';
    }
    
    console.log(`Widget de Agenda Inicializado para ${userId}.`);
}