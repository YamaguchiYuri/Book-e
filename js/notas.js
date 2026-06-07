// ======================================
// 🚀 CONSTANTES & SELECTORS
// ======================================
const MATERIAS_API_URL = 'http://localhost:8081/api/materias';
const NOTAS_API_URL = 'http://localhost:8081/api/notas';

const notasListArea = document.getElementById('notas-list-area');
const modalNotas = document.getElementById('modal-notas');

let CURRENT_USER_ID = null;

// ======================================
// 🚀 FUNÇÕES DE ACESSO À API
// ======================================
async function apiGet(url) {
    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na API GET (${response.status}): ${errorText || response.statusText}`);
    }
    return response.json();
}

async function apiSend(url, data, method) {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : null
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na API ${method} (${response.status}): ${errorText || response.statusText}`);
    }

    // Se não tiver corpo ou status 204, não tenta fazer .json()
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) return null;

    return response.json();
}

// Funções específicas da API
function loadMaterias(userId) {
    return apiGet(`${MATERIAS_API_URL}/buscar/${userId}`);
}
function loadNotasDaMateria(materiaId) {
    return apiGet(`${NOTAS_API_URL}/materia/${materiaId}`);
}
function createNota(notaDto) {
    return apiSend(NOTAS_API_URL, notaDto, 'POST');
}
function deleteNota(notaId) {
    return apiSend(`${NOTAS_API_URL}/${notaId}`, null, 'DELETE');
}

// ======================================
// 🧠 LÓGICA DE NEGÓCIO
// ======================================
function calculateMedia(notas) {
    if (!notas || notas.length === 0) return 0;
    // CORREÇÃO: nota_cadastro
    const totalNotas = notas.reduce((sum, nota) => sum + (parseFloat(nota.nota_cadastro) || 0), 0);
    return totalNotas / notas.length;
}

// ======================================
// ⚙️ CONTROLE DO MODAL
// ======================================
function openNotasModal() {
    if (modalNotas) modalNotas.classList.remove('hidden');
}
function closeNotasModal() {
    if (modalNotas) modalNotas.classList.add('hidden');
}

// ======================================
// ✨ RENDERIZAÇÃO & UI
// ======================================
async function getAddNotaFormHTML(userId) {
    let materias;
    try {
        materias = await loadMaterias(userId);
    } catch (error) {
        return `<li class="add-nota-form-container">
            <p style="color:red; font-size:10px; padding: 10px;">Erro ao carregar matérias: ${error.message}</p>
        </li>`;
    }

    // CORREÇÃO: m.id_materia
    const materiaOptions = materias.map(m => `<option value="${m.id_materia}">${m.nome_materia}</option>`).join('');

    return `<li class="add-nota-form-container">
        <h3>ADICIONAR NOVA NOTA</h3>
        <form id="add-nota-form">
            <div class="input-group flex-grow-2">
                <label>MATÉRIA</label>
                <select name="materiaId" required>
                    <option value="">Selecione</option>
                    ${materiaOptions}
                </select>
            </div>
            <div class="input-group">
                <label>TIPO</label>
                <select name="tipoNota" required>
                    <option value="">Tipo</option>
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                </select>
            </div>
            <div class="input-group">
                <label>NOTA</label>
                <input type="number" name="valor" min="0" max="10" step="0.1" placeholder="0.0" required>
            </div>
            <button type="submit" class="btn">Salvar</button>
        </form>
    </li>`;
}

async function renderNotas(userId) {
    const addFormHTML = await getAddNotaFormHTML(userId);

    let materias;
    try {
        materias = await loadMaterias(userId);
        if (!materias || materias.length === 0) {
            materias = [];
        }
        // CORREÇÃO: m.id_materia
        const notasDeTodas = await Promise.all(materias.map(m => loadNotasDaMateria(m.id_materia)));
        materias.forEach((m, i) => m.notas = notasDeTodas[i]);
    } catch (error) {
        notasListArea.innerHTML = addFormHTML + `<li style="color:red; font-size:10px; text-align:center;">Erro ao carregar dados: ${error.message}</li>`;
        return;
    }

    let materiasHTML = materias.map(materia => {
        const media = calculateMedia(materia.notas || []);
        let statusClass = 'status-neutro';
        let statusText = `Média: ${media.toFixed(1)}`;
        if (materia.notas?.length) {
            if (media >= 6.0) {
                statusClass = 'status-aprovado';
                statusText += ' (Aprovado)';
            } else {
                statusClass = 'status-reprovado';
                statusText += ' (Reprovado)';
            }
        }

        const notasFormatadas = (materia.notas || []).map(n =>
            // CORREÇÃO: n.id_nota_desempenho
            `<li data-nota-id="${n.id_nota_desempenho}">
                ${n.tiponota}: <strong>${n.nota_cadastro.toFixed(1)}</strong>
                <span class="delete-nota-btn" data-nota-id="${n.id_nota_desempenho}">[DEL]</span>
            </li>`
        ).join('');

        // CORREÇÃO: materia.id_materia
        return `<li class="materia-card" data-materia-id="${materia.id_materia}">
            <div class="materia-header">
                <h3>${materia.nome_materia}</h3>
                <span class="${statusClass}">${statusText}</span>
            </div>
            <div class="materia-notas-lista">
                <ul>
                    ${notasFormatadas.length > 0 ? notasFormatadas : '<li>Nenhuma nota cadastrada.</li>'}
                </ul>
            </div>
        </li>`;
    }).join('');

    notasListArea.innerHTML = addFormHTML + materiasHTML;

    const finalAddForm = document.getElementById('add-nota-form');
    if (finalAddForm) finalAddForm.addEventListener('submit', handleAddNotaSubmit);
}

// ======================================
// ⚙️ MANIPULADORES DE EVENTOS
// ======================================
async function handleAddNotaSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const materiaId = form.elements['materiaId'].value;
    const tipoNota = form.elements['tipoNota'].value;
    const valor = form.elements['valor'].value;

    if (!materiaId || !tipoNota || !valor) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const valorNum = parseFloat(valor);
    if (valorNum < 0 || valorNum > 10) {
        alert('A nota deve estar entre 0.0 e 10.0');
        return;
    }

    try {
        // CORREÇÃO: Objeto montado idêntico ao NotaDesempenhoPostDto
        await createNota({
            id_materia: Number(materiaId),
            nota_cadastro: valorNum,
            tiponota: tipoNota
        });
        form.reset();
        await renderNotas(CURRENT_USER_ID);
    } catch (error) {
        alert(`Erro ao adicionar nota: ${error.message}`);
    }
}

notasListArea.addEventListener('click', async function(e) {
    const deleteBtn = e.target.closest('.delete-nota-btn');
    if (!deleteBtn) return;

    const notaId = deleteBtn.dataset.notaId;
    if (!notaId) return;

    try {
        await deleteNota(notaId);
        await renderNotas(CURRENT_USER_ID);
    } catch (error) {
        alert(`Erro ao deletar nota: ${error.message}`);
    }
});

// ======================================
// 📦 EXPORT / INICIALIZAÇÃO
// ======================================
export function initNotas(userId) {
    CURRENT_USER_ID = userId;

    const closeButton = document.querySelector('#modal-notas .close_button');
    if (closeButton) closeButton.addEventListener('click', closeNotasModal);

    renderNotas(userId);
    openNotasModal();
}