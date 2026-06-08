// js/notas.js

const MATERIAS_API_URL = 'http://localhost:8081/api/materias';
const NOTAS_API_URL = 'http://localhost:8081/api/notas';
const FORMULAS_API_URL = 'http://localhost:8081/api/formulas';
const VARIAVEIS_API_URL = 'http://localhost:8081/api/variaveis';
const CALCULAR_API_URL = 'http://localhost:8081/api/calcular';
const FALTAS_API_URL = 'http://localhost:8081/api/faltas';

const notasListArea = document.getElementById('notas-list-area');
const modalNotas = document.getElementById('modal-notas');

let CURRENT_USER_ID = null;

// ==========================================
// FUNÇÕES DE COMUNICAÇÃO API
// ==========================================
async function apiGet(url) {
    const response = await fetch(url);
    if (response.status === 404) return []; 
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

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) return null;

    return response.json();
}

// ==========================================
// ACESSO AOS DADOS (HELPERS)
// ==========================================
function loadMaterias(userId) { return apiGet(`${MATERIAS_API_URL}/buscar/${userId}`); }
function loadNotasDaMateria(materiaId) { return apiGet(`${NOTAS_API_URL}/materia/${materiaId}`); }
function loadFormulaDaMateria(materiaId) { return apiGet(`${FORMULAS_API_URL}/materia/${materiaId}`); }
function loadVariaveisDaFormula(formulaId) { return apiGet(`${VARIAVEIS_API_URL}/formula/${formulaId}`); }
function getCalculo(formulaId, materiaId) { return apiGet(`${CALCULAR_API_URL}/${formulaId}/${materiaId}`); }
function loadFaltasDaMateria(materiaId) { return apiGet(`${FALTAS_API_URL}/listarPorMateria/${materiaId}`); }
function createNota(notaDto) { return apiSend(NOTAS_API_URL, notaDto, 'POST'); }
function deleteNota(notaId) { return apiSend(`${NOTAS_API_URL}/${notaId}`, null, 'DELETE'); }
function updateFaltas(idFalta, faltasDto) { return apiSend(`${FALTAS_API_URL}/${idFalta}`, faltasDto, 'PUT'); }
function createFaltas(faltasDto) { return apiSend(`${FALTAS_API_URL}/criar`, faltasDto, 'POST'); }

// ==========================================
// CONTROLES DE MODAL
// ==========================================
function openNotasModal() { if (modalNotas) modalNotas.classList.remove('hidden'); }
function closeNotasModal() { if (modalNotas) modalNotas.classList.add('hidden'); }

// ==========================================
// RENDERIZAÇÃO
// ==========================================
async function getAddNotaFormHTML(userId) {
    let materias;
    try { materias = await loadMaterias(userId); } catch (error) {
        return `<li class="add-nota-form-container"><p style="color:red; font-size:10px; padding: 10px;">Erro ao carregar matérias: ${error.message}</p></li>`;
    }

    const semestreSelecionado = Number(localStorage.getItem('semestreVisualizado')) || 1;
    const materiasFiltradas = materias.filter(m => Number(m.semestre_materia || m.semestremateria) === semestreSelecionado);
    const materiaOptions = materiasFiltradas.map(m => `<option value="${m.idmateria}">${m.nomemateria}</option>`).join('');

    return `<li class="add-nota-form-container">
        <h3>ADICIONAR NOVA NOTA</h3>
        <form id="add-nota-form">
            <div class="input-group">
                <label>MATÉRIA</label>
                <select name="materiaId" required><option value="">Selecione a matéria</option>${materiaOptions}</select>
            </div>
            <div class="input-group">
                <label>TIPO DA NOTA</label>
                <select name="tipoNota" required><option value="">Selecione a matéria primeiro</option></select>
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
        if (!materias || materias.length === 0) materias = [];
        const semestre = Number(localStorage.getItem('semestreVisualizado')) || 1;
        materias = materias.filter(m => Number(m.semestre_materia || m.semestremateria) === semestre);

        const [notasDeTodas, formulasDeTodas, faltasDeTodas] = await Promise.all([
            Promise.all(materias.map(m => loadNotasDaMateria(m.idmateria))),
            Promise.all(materias.map(m => loadFormulaDaMateria(m.idmateria).catch(() => []))),
            Promise.all(materias.map(m => loadFaltasDaMateria(m.idmateria).catch(() => [])))
        ]);

        const mediasCalculadas = await Promise.all(materias.map((m, i) => {
            const formulas = formulasDeTodas[i];
            if (formulas && formulas.length > 0) {
                const formulaId = formulas[0].idformula || formulas[0].id;
                return getCalculo(formulaId, m.idmateria).then(res => res.resultado || 0).catch(() => 0);
            }
            return Promise.resolve(0);
        }));

        materias.forEach((m, i) => {
            m.notas = notasDeTodas[i];
            m.mediaCalculada = mediasCalculadas[i];
            m.faltas = faltasDeTodas[i] && faltasDeTodas[i].length > 0 ? faltasDeTodas[i][0] : null;
        });
    } catch (error) {
        notasListArea.innerHTML = addFormHTML + `<li style="color:red; font-size:10px; text-align:center;">Erro: ${error.message}</li>`;
        return;
    }

    let materiasHTML = await Promise.all(materias.map(async (materia) => {
        const notaAprovacao = materia.aprovacao || 6.0;
        const media = materia.mediaCalculada;
        
        const faltaObj = materia.faltas;
        const numFaltas = faltaObj ? faltaObj.numfaltas : 0;
        const limiteFaltas = faltaObj ? (faltaObj.limitefaltas || 20) : 20;
        
        const estaReprovado = (media < notaAprovacao) || (numFaltas > limiteFaltas);
        const statusClass = estaReprovado ? 'status-reprovado' : 'status-aprovado';
        const statusText = `Média: ${media.toFixed(1)} (${estaReprovado ? 'Reprovado' : 'Aprovado'})`;

        const notasFormatadas = await Promise.all((materia.notas || []).map(async (n) => {
            let nomeVar = "Carregando...";
            if (n.idvariavel) {
                try {
                    const info = await apiGet(`http://localhost:8081/api/variaveis/buscar?id=${n.idvariavel}`);
                    nomeVar = info.nome || "Var";
                } catch(e) { nomeVar = "Var"; }
            }
            return `<li data-nota-id="${n.idnotadesempenho}">
                ${nomeVar}: <strong>${n.notacadastro || 0}</strong>
                <span class="delete-nota-btn" data-nota-id="${n.idnotadesempenho}">[DEL]</span>
            </li>`;
        }));

        // Layout isolado
        return `<li class="materia-card" data-materia-id="${materia.idmateria}">
            <div class="materia-header">
                <h3>${materia.nomemateria}</h3>
            </div>
            
            <div class="faltas-isolated-box">
                <div class="faltas-title">CONTROLE DE FALTAS</div>
                <div class="faltas-row">
                    <span>FALTAS: ${numFaltas}/${limiteFaltas}</span>
                    <div class="faltas-buttons">
                        <button class="btn-falta" onclick="window.alterarFalta(${faltaObj?.idfaltamateria || 0}, -1, ${materia.idmateria})">-</button>
                        <button class="btn-falta" onclick="window.alterarFalta(${faltaObj?.idfaltamateria || 0}, 1, ${materia.idmateria})">+</button>
                    </div>
                </div>
            </div>

            <div class="media-container">
                <span class="${statusClass}">${statusText}</span>
            </div>

            <div class="materia-notas-lista">
                <ul>${notasFormatadas.join('')}</ul>
            </div>
        </li>`;
    }));

    notasListArea.innerHTML = addFormHTML + materiasHTML.join('');

    const form = document.getElementById('add-nota-form');
    if (form) {
        form.addEventListener('submit', handleAddNotaSubmit);
        form.addEventListener('change', async (e) => {
            if (e.target.name === 'materiaId') {
                const matId = e.target.value;
                const selectTipo = form.elements['tipoNota'];
                selectTipo.innerHTML = '<option value="">Carregando...</option>';
                try {
                    const formulas = await loadFormulaDaMateria(matId);
                    if (formulas && formulas.length > 0) {
                        const variaveis = await loadVariaveisDaFormula(formulas[0].idformula || formulas[0].id);
                        selectTipo.innerHTML = '<option value="">Selecione o Tipo</option>';
                        variaveis.forEach(v => { selectTipo.innerHTML += `<option value="${v.id}">${v.nome}</option>`; });
                    } else { selectTipo.innerHTML = '<option value="">Sem fórmula</option>'; }
                } catch (err) { selectTipo.innerHTML = '<option value="">Erro</option>'; }
            }
        });
    }
}

// ==========================================
// LÓGICA DE AÇÕES
// ==========================================
window.alterarFalta = async function(idFalta, delta, materiaId = null) {
    try {
        if (idFalta && idFalta !== 0) {
            const atual = await apiGet(`http://localhost:8081/api/faltas/buscar?id=${idFalta}`);
            const novoValor = Math.max(0, atual.numfaltas + delta);
            await updateFaltas(idFalta, { numfaltas: novoValor, limitefaltas: atual.limitefaltas });
        } else if (materiaId) {
            await createFaltas({
                idmateria: materiaId,
                numfaltas: Math.max(0, delta),
                limitefaltas: 20
            });
        }
        await renderNotas(CURRENT_USER_ID);
    } catch(e) { alert("Erro ao atualizar falta: " + e.message); }
};

async function handleAddNotaSubmit(e) {
    e.preventDefault();
    const form = e.target;
    try {
        await createNota({
            idmateria: Number(form.elements['materiaId'].value), 
            notacadastro: parseFloat(form.elements['valor'].value),
            idvariavel: Number(form.elements['tipoNota'].value)
        });
        form.reset();
        await renderNotas(CURRENT_USER_ID);
    } catch (error) { alert(`Erro: ${error.message}`); }
}

notasListArea.addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete-nota-btn')) {
        await deleteNota(e.target.dataset.notaId);
        await renderNotas(CURRENT_USER_ID);
    }
});

export function initNotas(userId) {
    CURRENT_USER_ID = userId;
    const closeButton = document.querySelector('#modal-notas .close_button');
    if (closeButton) closeButton.addEventListener('click', closeNotasModal);
    renderNotas(userId);
    openNotasModal();
}