import { getNewZIndex } from './janelas.js';

let CURRENT_USER_ID = null;
let currentEditingNoteId = null; // null = Criando, ID = Editando

const API_URL_ANOTACOES = 'http://localhost:8081/api/anotacoes';
const API_URL_MATERIAS = 'http://localhost:8081/api/materias';

// Seletores
const noteListArea = document.getElementById('note-list-area');
const btnShowNewNoteModal = document.getElementById('btn-show-new-note-modal');
const subModalOverlay = document.getElementById('sub-modal-overlay');
const modalNovaAnotacao = document.getElementById('modal-nova-anotacao');
const btnSaveNewNote = document.getElementById('btn-save-new-note');
const btnCancelNewNote = document.getElementById('btn-cancel-new-note');
const btnCancelNewNote2 = document.getElementById('btn-cancel-new-note-2');
const newNoteTitleInput = document.getElementById('new-note-title');
const newNoteContentInput = document.getElementById('new-note-content');
const newNoteMateriaSelect = document.getElementById('new-note-materia');

// ==========================================
// FUNÇÕES DE COMUNICAÇÃO COM A API
// ==========================================
async function apiGet(url) {
    const response = await fetch(url);
    if (response.status === 404) return []; 
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function apiSend(url, data, method) {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : null
    });
    if (!response.ok) throw new Error(await response.text());
    
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) return null;
    return response.json();
}

// ==========================================
// CARREGAR E RENDERIZAR
// ==========================================
async function renderNotes() {
    try {
        // 1. Busca todas as matérias e acha as do ciclo atual
        const materias = await apiGet(`${API_URL_MATERIAS}/buscar/${CURRENT_USER_ID}`);
        const semestreSelecionado = Number(localStorage.getItem('semestreVisualizado')) || 1;
        
        const materiasDoSemestre = materias.filter(m => {
            const ciclo = m.semestre_materia || m.semestremateria;
            return Number(ciclo) === semestreSelecionado;
        });
        
        // Pega apenas os IDs das matérias válidas do ciclo atual
        const validMateriaIds = materiasDoSemestre.map(m => m.idmateria);

        // 2. Busca as anotações e filtra pelas matérias permitidas
        const notes = await apiGet(`${API_URL_ANOTACOES}/usuario/${CURRENT_USER_ID}`);
        
        const notesDoSemestre = notes.filter(n => {
            // Verifica onde o ID da matéria veio no DTO (direto ou dentro do objeto materia)
            const matId = n.idmateria || (n.materia && n.materia.idmateria);
            return validMateriaIds.includes(matId);
        });

        // 3. Renderiza a tela
        noteListArea.innerHTML = ''; 
        if (notesDoSemestre.length === 0) {
            noteListArea.innerHTML = '<p style="color:white; font-size:10px;">Nenhuma anotação neste ciclo.</p>';
        } else {
            notesDoSemestre.forEach(note => {
                const noteId = note.id || note.idanotacao;
                // No DTO é provavel que venha como "titulo", adaptando para evitar erro
                const titulo = note.titulo || note.title || 'Sem Título'; 
                
                const noteHTML = `
                    <div class="note-item" data-note-id="${noteId}">
                        <span class="note-delete-btn" data-note-id="${noteId}">X</span>
                        <p>${titulo}</p>
                        <button class="note-folder-btn" data-note-id="${noteId}">
                            <img src="./assets/neon-folder.png" alt="Pasta">
                        </button>
                    </div>
                `;
                noteListArea.innerHTML += noteHTML;
            });
        }

        // Atribui os eventos de clique novamente
        noteListArea.querySelectorAll('.note-delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteNote);
        });
        noteListArea.querySelectorAll('.note-folder-btn').forEach(btn => {
            btn.addEventListener('click', openModalForEdit);
        });

    } catch (error) {
        console.error("Erro ao carregar anotações:", error);
        noteListArea.innerHTML = '<p style="color:red; font-size:10px;">Erro ao carregar anotações.</p>';
    }
}

// ==========================================
// AÇÕES DO USUÁRIO
// ==========================================
async function handleSaveNote() {
    const titulo = newNoteTitleInput.value.trim();
    const texto = newNoteContentInput.value.trim();
    const idmateria = newNoteMateriaSelect.value;

    if (!titulo || !idmateria || !texto) {
        alert('Por favor, preencha a matéria, o título e o conteúdo.');
        return;
    }

    try {
        if (currentEditingNoteId === null) {
            // POST - Criar
            await apiSend(`${API_URL_ANOTACOES}/criar`, {
                titulo: titulo,
                texto: texto,
                iduser: Number(CURRENT_USER_ID),
                idmateria: Number(idmateria)
            }, 'POST');
        } else {
            // PUT - Atualizar
            await apiSend(`${API_URL_ANOTACOES}/${currentEditingNoteId}`, {
                titulo: titulo,
                texto: texto,
                idmateria: Number(idmateria)
            }, 'PUT');
        }

        closeNewNoteModal();
        await renderNotes();
    } catch (error) {
        alert("Erro ao salvar a anotação: " + error.message);
    }
}

async function handleDeleteNote(e) {
    e.stopPropagation(); 
    const noteIdToDelete = e.target.dataset.noteId;

    if (!confirm('Tem certeza que deseja apagar esta anotação?')) return;

    try {
        await apiSend(`${API_URL_ANOTACOES}/${noteIdToDelete}`, null, 'DELETE');
        await renderNotes();
    } catch (error) {
        alert("Erro ao deletar: " + error.message);
    }
}

// ==========================================
// CONTROLE DE MODAL
// ==========================================
async function populateMateriaDropdown() {
    const materias = await apiGet(`${API_URL_MATERIAS}/buscar/${CURRENT_USER_ID}`);
    const semestreSelecionado = Number(localStorage.getItem('semestreVisualizado')) || 1;
    
    const materiasDoSemestre = materias.filter(m => {
        const ciclo = m.semestre_materia || m.semestremateria;
        return Number(ciclo) === semestreSelecionado;
    });

    newNoteMateriaSelect.innerHTML = '<option value="">Selecione a Matéria</option>';
    materiasDoSemestre.forEach(m => {
        newNoteMateriaSelect.innerHTML += `<option value="${m.idmateria}">${m.nomemateria}</option>`;
    });
}

function _openModal() {
    subModalOverlay.style.zIndex = getNewZIndex();
    modalNovaAnotacao.style.zIndex = getNewZIndex();
    subModalOverlay.classList.remove('hidden');
    modalNovaAnotacao.classList.remove('hidden');
}

async function openModalForCreate() {
    currentEditingNoteId = null;
    newNoteTitleInput.value = '';
    newNoteContentInput.value = '';
    
    await populateMateriaDropdown();
    _openModal();
    newNoteTitleInput.focus();
}

async function openModalForEdit(e) {
    const noteIdToEdit = e.currentTarget.dataset.noteId;
    
    try {
        // Busca os dados atualizados desta anotação no banco
        const note = await apiGet(`${API_URL_ANOTACOES}/buscar/${noteIdToEdit}`);
        
        currentEditingNoteId = note.id || note.idanotacao; 
        newNoteTitleInput.value = note.titulo;
        newNoteContentInput.value = note.texto;

        await populateMateriaDropdown();
        
        // Seleciona a matéria atual da anotação
        const matId = note.idmateria || (note.materia && note.materia.idmateria);
        newNoteMateriaSelect.value = matId;

        _openModal();
    } catch (error) {
        alert("Erro ao abrir anotação: " + error.message);
    }
}

function closeNewNoteModal() {
    subModalOverlay.classList.add('hidden');
    modalNovaAnotacao.classList.add('hidden');
    currentEditingNoteId = null;
}

// ==========================================
// EVENTOS GLOBAIS
// ==========================================
// Se o usuário mudar de semestre nas setinhas, as pastas se atualizam sozinhas!
window.addEventListener('semestreMudou', async () => {
    if (CURRENT_USER_ID) await renderNotes();
});

// Se o usuário criar/excluir uma matéria, ela some/aparece do dropdown de anotações
window.addEventListener('materiaAdicionada', async () => {
    if (CURRENT_USER_ID) await renderNotes();
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
export function initAnotacoes(userId) { 
    CURRENT_USER_ID = userId;

    btnShowNewNoteModal.addEventListener('click', openModalForCreate); 
    btnSaveNewNote.addEventListener('click', handleSaveNote);
    btnCancelNewNote.addEventListener('click', closeNewNoteModal);
    btnCancelNewNote2.addEventListener('click', closeNewNoteModal);
    
    renderNotes(); 
    console.log(`Módulo de Anotações Inicializado para ${userId}.`);
}