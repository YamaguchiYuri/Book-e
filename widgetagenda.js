import { loadData } from './storage.js';

let AGENDA_STORAGE_KEY = '';
const listaWidget = document.getElementById('agenda-widget-list');


function formatWidgetDate(dateString) {
    if (!dateString) return '??/??';

    const date = new Date(dateString + 'T12:00:00'); 
    

    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
    return `${dia}/${mes}`;
}


export function renderAgendaWidget() {
    if (!listaWidget) return; 

    const events = loadData(AGENDA_STORAGE_KEY);
    

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date + 'T12:00:00');
        return eventDate >= today;
    });
    

    upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));


    const top3Events = upcomingEvents.slice(0, 3);


    listaWidget.innerHTML = ''; 
    if (top3Events.length === 0) {
        listaWidget.innerHTML = '<li style="background:none; box-shadow:none;">Sem eventos futuros.</li>';
        return;
    }

    top3Events.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${formatWidgetDate(event.date)}:</strong> ${event.type}`;
        listaWidget.appendChild(li);
    });
}



export function initAgendaWidget(userId) {

    AGENDA_STORAGE_KEY = `booke_agenda_${userId}`;
    

    renderAgendaWidget();
    
    console.log(`Widget de Agenda Inicializado para ${userId}.`);
}