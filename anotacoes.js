import { saveData, loadData } from './storage.js';
import { getNewZIndex } from './janelas.js';

// Chave de storage específica deste módulo
const NOTES_STORAGE_KEY = 'booke-anotacoes';

// Seletores (só os que este módulo usa)
const noteListArea = document.getElementById('note-list-area');
const btnShowNewNoteModal = document.getElementById('btn-show-new-note-modal');
const subModalOverlay = document.getElementById('sub-modal-overlay');
const modalNovaAnotacao = document.getElementById('modal-nova-anotacao');
const btnSaveNewNote = document.getElementById('btn-save-new-note');
const btnCancelNewNote = document.getElementById('btn-cancel-new-note');
const btnCancelNewNote2 = document.getElementById('btn-cancel-new-note-2');
const newNoteTitleInput = document.getElementById('new-note-title');
const newNoteContentInput = document.getElementById('new-note-content');



function loadNotes() {
    return loadData(NOTES_STORAGE_KEY);
}

function saveNotes(notesArray) {
    saveData(NOTES_STORAGE_KEY, notesArray);
}

function renderNotes() {
    const notes = loadNotes();
    
    // Limpa a lista antiga
    noteListArea.innerHTML = ''; 

    // Cria o HTML para cada nota
    notes.forEach(note => {
        //   vvv--- ADICIONAMOS O BOTÃO "X" AQUI ---vvv
        const noteHTML = `
            <div class="note-item" data-note-id="${note.id}">
                <span class="note-delete-btn" data-note-id="${note.id}">X</span>
                <p>${note.title}</p>
                <button class="note-folder-btn">
                    <img src="./assets/neon-folder.png" alt="Pasta">
                </button>
            </div>
        `;
        // Adiciona o HTML na área da lista
        noteListArea.innerHTML += noteHTML;
    });
    
    // --- IMPORTANTE: ADICIONA OS LISTENERS DEPOIS DE RENDERIZAR ---
    // Encontra todos os novos botões "X" que acabamos de criar
    noteListArea.querySelectorAll('.note-delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteNote);
    });

    // (O seu código futuro para abrir a pasta também viria aqui)
    // noteListArea.querySelectorAll('.note-folder-btn').forEach(button => {
    //    button.addEventListener('click', handleOpenNote);
    // });
}

/**
--APAGAR NOTAS
 * @param {Event} e
 */
function handleDeleteNote(e) {
    // Impede que o clique no "X" também abra a pasta
    e.stopPropagation(); 

    const button = e.target;
    const noteIdToDelete = button.dataset.noteId;

    if (!confirm('Tem certeza que deseja apagar esta anotação?')) {
        return; // Não faz nada se o usuário cancelar
    }

    //  Carrega as notas
    let notes = loadNotes();
    
    //Filtra, removendo a nota com o ID clicado
    // (O '!=' funciona bem aqui pois 'note.id' é número e 'noteIdToDelete' é string)
    notes = notes.filter(note => note.id != noteIdToDelete);

    saveNotes(notes);

    //renderiza a tela para mostrar a mudança
    renderNotes();
}

function handleSaveNote() {
    const title = newNoteTitleInput.value;
    const content = newNoteContentInput.value;

    if (!title) {
        alert('Qual o titulo da sua anotação?');
        return;
    }

    const newNote = {
        id: Date.now(),
        title: title,
        content: content
    };

    const notes = loadNotes();
    notes.push(newNote);
    saveNotes(notes);

    renderNotes();
    closeNewNoteModal();
}

function openNewNoteModal() {
    newNoteTitleInput.value = '';
    newNoteContentInput.value = '';
    
    // zindex
    subModalOverlay.style.zIndex = getNewZIndex();
    modalNovaAnotacao.style.zIndex = getNewZIndex();

    subModalOverlay.classList.remove('hidden');
    modalNovaAnotacao.classList.remove('hidden');
}

function closeNewNoteModal() {
    subModalOverlay.classList.add('hidden');
    modalNovaAnotacao.classList.add('hidden');
}

// --- Event Listeners ---

// funçao exportada
export function initAnotacoes() {
    btnShowNewNoteModal.addEventListener('click', openNewNoteModal);
    btnSaveNewNote.addEventListener('click', handleSaveNote);
    btnCancelNewNote.addEventListener('click', closeNewNoteModal);
    btnCancelNewNote2.addEventListener('click', closeNewNoteModal);
    
    // Carga inicial
    renderNotes();

    console.log("Módulo de Anotações Inicializado.");
}