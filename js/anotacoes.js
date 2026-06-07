import { saveData, loadData } from './storage.js';
import { getNewZIndex } from './janelas.js';

let currentEditingNoteId = null; // null = Criando, ou um ID = Editando

// Chave de storage específica deste módulo
let NOTES_STORAGE_KEY = '';

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
    noteListArea.innerHTML = ''; 

    notes.forEach(note => {
        const noteHTML = `
            <div class="note-item" data-note-id="${note.id}">
                <span class="note-delete-btn" data-note-id="${note.id}">X</span>
                <p>${note.title}</p>
                <button class="note-folder-btn" data-note-id="${note.id}">
                    <img src="./assets/neon-folder.png" alt="Pasta">
                </button>
            </div>
        `;
        noteListArea.innerHTML += noteHTML;
    });
    
    // Listener de deletar
    noteListArea.querySelectorAll('.note-delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteNote);
    });

    // abrir e edita
    noteListArea.querySelectorAll('.note-folder-btn').forEach(button => {
        button.addEventListener('click', openModalForEdit);
    });
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

    let notes = loadNotes();

    if (currentEditingNoteId === null) {
        const newNote = {
            id: Date.now(),
            title: title,
            content: content
        };
        notes.push(newNote);
    } else {
        notes = notes.map(note => {
            if (note.id == currentEditingNoteId) {
                // Retorna a nota ATUALIZADA
                return { 
                    ...note, // Mantém o ID original
                    title: title, 
                    content: content 
                };
            }
            // Retorna as outras notas sem alteração
            return note;
        });
    }

    saveNotes(notes);  // Salva o array modificado
    renderNotes();     // Atualiza a tela
    closeNewNoteModal(); // Fecha o modal
}

function _openModal() {
    // zindex
    subModalOverlay.style.zIndex = getNewZIndex();
    modalNovaAnotacao.style.zIndex = getNewZIndex();

    subModalOverlay.classList.remove('hidden');
    modalNovaAnotacao.classList.remove('hidden');

    newNoteTitleInput.focus(); // Foca no título
}

/**
 * ATUALIZADO: Prepara o modal para CRIAR uma nova nota.
 */
function openModalForCreate() {
    currentEditingNoteId = null; // Garante que estamos criando
    newNoteTitleInput.value = '';
    newNoteContentInput.value = '';
    
    _openModal(); // Chama a função base
}
function openModalForEdit(e) {
    const noteIdToEdit = e.currentTarget.dataset.noteId;
    
    const notes = loadNotes();
    const note = notes.find(n => n.id == noteIdToEdit);

    if (!note) {
        alert('Erro: Anotação não encontrada.');
        return;
    }
    currentEditingNoteId = note.id; 
    newNoteTitleInput.value = note.title;
    newNoteContentInput.value = note.content;

    _openModal(); // Chama a função base
}

function closeNewNoteModal() {
    subModalOverlay.classList.add('hidden');
    modalNovaAnotacao.classList.add('hidden');
    currentEditingNoteId = null;
}


// funçao exportada
export function initAnotacoes(userId) { 

    NOTES_STORAGE_KEY = `booke_anotacoes_${userId}`;

    btnShowNewNoteModal.addEventListener('click', openModalForCreate); 
    btnSaveNewNote.addEventListener('click', handleSaveNote);
    btnCancelNewNote.addEventListener('click', closeNewNoteModal);
    btnCancelNewNote2.addEventListener('click', closeNewNoteModal);
    
    renderNotes(); 

    console.log(`Módulo de Anotações Inicializado para ${userId}.`);
}