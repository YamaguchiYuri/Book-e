import { saveData, loadData } from './storage.js';
import { getNewZIndex } from './janelas.js';






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


let currentEditingNoteId = null; // null = Criando, ou um ID = Editando
// Chave de storage específica deste módulo
const NOTES_STORAGE_KEY = 'booke-anotacoes';


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
            <div class="note-item">
                <span class="note-delete-btn" data-note-id="${note.id}">X</span>
                <p>${note.title}</p>
                <button class="note-folder-btn" data-note-id="${note.id}">
                    <img src="./assets/neon-folder.png" alt="Pasta">
                </button>
            </div>
        `;
        noteListArea.innerHTML += noteHTML;
    });
    
    // --- ADICIONA OS LISTENERS DEPOIS DE RENDERIZAR ---
    
    // Listener para APAGAR (botão X)
    noteListArea.querySelectorAll('.note-delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteNote);
    });

    // Listener para EDITAR (botão da pasta)
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
        alert('Por favor, dê um título à sua anotação.');
        return;
    }

    let notes = loadNotes(); // Carrega as notas

    if (currentEditingNoteId === null) {
        // ---- MODO CRIAÇÃO ----
        const newNote = {
            id: Date.now(),
            title: title,
            content: content
        };
        notes.push(newNote); // Adiciona a nova nota

    } else {
        // ---- MODO EDIÇÃO ----
        // Usa .map() para criar um NOVO array
        notes = notes.map(note => {
            // Se for a nota que estamos editando...
            if (note.id == currentEditingNoteId) {
                // ...retorna a nota com os dados atualizados.
                return { 
                    ...note, // Mantém o ID original
                    title: title, 
                    content: content 
                };
            }
            // Senão, retorna a nota como ela era.
            return note;
        });
    }

    saveNotes(notes);  // Salva o array (novo ou modificado)
    renderNotes();     // Atualiza a tela
    closeNewNoteModal(); // Fecha o modal
}

function openNewNoteModal() {
    // Usa a função importada!
    subModalOverlay.style.zIndex = getNewZIndex();
    modalNovaAnotacao.style.zIndex = getNewZIndex();

    subModalOverlay.classList.remove('hidden');
    modalNovaAnotacao.classList.remove('hidden');
    
    // Foca no primeiro campo
    newNoteTitleInput.focus();
}

/**
 * NOVA: Prepara o modal para CRIAR uma nova nota.
 */
function openModalForCreate() {
    currentEditingNoteId = null; // Estamos criando, não editando
    newNoteTitleInput.value = '';  // Limpa os campos
    newNoteContentInput.value = '';
    
    openNewNoteModal(); // Chama a função que abre
}

/**
 * NOVA: Prepara o modal para EDITAR uma nota existente.
 * @param {Event} e O evento do clique
 */
function openModalForEdit(e) {
    const noteIdToEdit = e.currentTarget.dataset.noteId;
    
    // Carrega as notas e encontra a nota específica
    const notes = loadNotes();
    const note = notes.find(n => n.id == noteIdToEdit);

    if (!note) {
        alert('Erro: Anotação não encontrada.');
        return;
    }

    currentEditingNoteId = note.id; // Define o ID que estamos editando
    newNoteTitleInput.value = note.title; // Preenche os campos
    newNoteContentInput.value = note.content;

    openNewNoteModal(); // Chama a função que abre
}

/**
 * Fecha o sub-modal de "Criar Anotação" e reseta o estado.
 */
function closeNewNoteModal() {
    subModalOverlay.classList.add('hidden');
    modalNovaAnotacao.classList.add('hidden');
    currentEditingNoteId = null; // Reseta o estado de edição
}

// --- Event Listeners ---

// funçao exportada
export function initAnotacoes() {
    // ATUALIZADO: Chama a função de CRIAR
    btnShowNewNoteModal.addEventListener('click', openModalForCreate); 
    
    btnSaveNewNote.addEventListener('click', handleSaveNote);
    btnCancelNewNote.addEventListener('click', closeNewNoteModal);
    btnCancelNewNote2.addEventListener('click', closeNewNoteModal);
    
    // Carga inicial
    renderNotes();

    console.log("Módulo de Anotações Inicializado.");
}