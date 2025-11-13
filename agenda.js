// Importa do seu módulo de storage
import { saveData, loadData } from './storage.js';

// Chave do localStorage (será definida pelo app.js)
let AGENDA_STORAGE_KEY = '';

// --- 1. Seletores (ATUALIZADOS COM SEUS IDs) ---
const listArea = document.getElementById('lista-agenda');
const eventTypeInput = document.getElementById('add-tipo');
const eventDateInput = document.getElementById('add-data');
const addEventButton = document.getElementById('btnAdd-agenda');

// --- 2. Funções de Dados ---

function loadAgenda() {
    const events = loadData(AGENDA_STORAGE_KEY);
    // Ordena os eventos pela data
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    return events;
}

function saveAgenda(events) {
    saveData(AGENDA_STORAGE_KEY, events);
}

// --- renderiza os dados---

/**
 * sempre atualiza a agenda
 */
function renderAgenda() {
    const events = loadAgenda();
    listArea.innerHTML = ''; // Limpa a lista

    if (events.length === 0) {
        listArea.innerHTML = '<p style="color:white; text-align:center; top:10%">Nenhum compromisso.</p>';
        return;
    }

    events.forEach(event => {
        const itemHTML = `
            <div class="agenda-item" data-event-id="${event.id}">
                <div class="agenda-item-details">
                    <span><strong>Tipo:</strong> ${event.type}</span>
                    <span><strong>Data:</strong> ${formatDate(event.date)}</span>
                </div>
                <span class="agenda-item-delete" data-event-id="${event.id}">X</span>
            </div>
        `;
        listArea.innerHTML += itemHTML;
    });

    // Adiciona os "escutadores" de clique nos botões "X"
    listArea.querySelectorAll('.agenda-item-delete').forEach(button => {
        button.addEventListener('click', handleDeleteEvent);
    });
}

/**
 * Adiciona um novo evento
 */
function handleAddEvent() {
    const type = eventTypeInput.value;
    const date = eventDateInput.value; 

    if (!type || !date) {
        alert('Por favor, preencha o tipo e a data do compromisso.');
        return;
    }

    const newEvent = {
        id: Date.now(), // ID único
        type: type,
        date: date
    };

    const events = loadAgenda();
    events.push(newEvent);
    saveAgenda(events);
    renderAgenda(); // Atualiza a tela

    // Limpa os campos
    eventTypeInput.value = '';
    eventDateInput.value = '';
}

/**
 * Deleta um evento
 */
function handleDeleteEvent(e) {
    const eventId = e.target.dataset.eventId;
    
    let events = loadAgenda();
    events = events.filter(event => event.id != eventId);
    saveAgenda(events);
    renderAgenda();
}

function formatDate(dateString) {
    if (!dateString) return 'Data indefinida';
    const date = new Date(dateString + 'T12:00:00'); 
    return date.toLocaleDateString('pt-BR');
}


export function initAgenda(userId) {

    AGENDA_STORAGE_KEY = `booke_agenda_${userId}`;
    
    //bootao de adicionar novos na agenda
    addEventButton.addEventListener('click', handleAddEvent);
    
 
    renderAgenda(); 
    
}