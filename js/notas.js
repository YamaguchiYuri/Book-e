const MATERIAS_API_URL = 'http://localhost:8081/api/materias';
const NOTAS_API_URL = 'http://localhost:8081/api/notas';
const FORMULAS_API_URL = 'http://localhost:8081/api/formulas';
const VARIAVEIS_API_URL = 'http://localhost:8081/api/variaveis';
const CALCULAR_API_URL = 'http://localhost:8081/api/calcular';

const notasListArea = document.getElementById('notas-list-area');
const modalNotas = document.getElementById('modal-notas');

let CURRENT_USER_ID = null;

async function apiGet(url) {
    const response = await fetch(url);
    if (response.status === 404) {
        return []; 
    }
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
// FUNÇÕES DE ACESSO AOS ENDPOINTS
// ==========================================
function loadMaterias(userId) {
    return apiGet(`${MATERIAS_API_URL}/buscar/${userId}`);
}
function loadNotasDaMateria(materiaId) {
    return apiGet(`${NOTAS_API_URL}/materia/${materiaId}`);
}
function loadFormulaDaMateria(materiaId) {
    return apiGet(`${FORMULAS_API_URL}/materia/${materiaId}`);
}
function loadVariaveisDaFormula(formulaId) {
    return apiGet(`${VARIAVEIS_API_URL}/formula/${formulaId}`);
}
function getCalculo(formulaId, materiaId) {
    return apiGet(`${CALCULAR_API_URL}/${formulaId}/${materiaId}`);
}
function createNota(notaDto) {
    return apiSend(NOTAS_API_URL, notaDto, 'POST');
}
function deleteNota(notaId) {
    return apiSend(`${NOTAS_API_URL}/${notaId}`, null, 'DELETE');
}

// ==========================================
// CONTROLES DE MODAL
// ==========================================
function openNotasModal() {
    if (modalNotas) modalNotas.classList.remove('hidden');
}
function closeNotasModal() {
    if (modalNotas) modalNotas.classList.add('hidden');
}

// ==========================================
// RENDERIZAÇÃO DO FORMULÁRIO E LISTA
// ==========================================
async function getAddNotaFormHTML(userId) {
    let materias;
    try {
        materias = await loadMaterias(userId);
    } catch (error) {
        return `<li class="add-nota-form-container">
            <p style="color:red; font-size:10px; padding: 10px;">Erro ao carregar matérias: ${error.message}</p>
        </li>`;
    }

    const semestreSelecionado = Number(localStorage.getItem('semestreVisualizado')) || 1;
    const materiasFiltradas = materias.filter(m => {
        const ciclo = m.semestre_materia || m.semestremateria;
        return Number(ciclo) === semestreSelecionado;
    });

    const materiaOptions = materiasFiltradas.map(m => `<option value="${m.idmateria}">${m.nomemateria}</option>`).join('');

    return `<li class="add-nota-form-container">
        <h3>ADICIONAR NOVA NOTA</h3>
        <form id="add-nota-form">
            <div class="input-group">
                <label>MATÉRIA</label>
                <select name="materiaId" required>
                    <option value="">Selecione a matéria</option>
                    ${materiaOptions}
                </select>
            </div>
            
            <div class="input-group">
                <label>TIPO DA NOTA</label>
                <select name="tipoNota" required>
                    <option value="">Selecione a matéria primeiro</option>
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
        if (!materias || materias.length === 0) materias = [];
        
        const semestreSelecionado = Number(localStorage.getItem('semestreVisualizado')) || 1;
        materias = materias.filter(m => {
            const ciclo = m.semestre_materia || m.semestremateria;
            return Number(ciclo) === semestreSelecionado;
        });

        const notasDeTodas = await Promise.all(materias.map(m => loadNotasDaMateria(m.idmateria)));
        const formulasDeTodas = await Promise.all(materias.map(m => loadFormulaDaMateria(m.idmateria).catch(() => [])));

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
        });
    } catch (error) {
        notasListArea.innerHTML = addFormHTML + `<li style="color:red; font-size:10px; text-align:center;">Erro: ${error.message}</li>`;
        return;
    }

    let materiasHTML = await Promise.all(materias.map(async (materia) => {
        const media = materia.mediaCalculada;
        let statusClass = media >= 6.0 ? 'status-aprovado' : 'status-reprovado';
        let statusText = `Média: ${media.toFixed(1)} (${media >= 6.0 ? 'Aprovado' : 'Reprovado'})`;

        // Busca o nome real de cada variável usando o ID que está no JSON das notas
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

        return `<li class="materia-card" data-materia-id="${materia.idmateria}">
            <div class="materia-header">
                <h3>${materia.nomemateria}</h3>
                <span class="${statusClass}">${statusText}</span>
            </div>
            <div class="materia-notas-lista">
                <ul>${notasFormatadas.join('')}</ul>
            </div>
        </li>`;
    }));

    notasListArea.innerHTML = addFormHTML + materiasHTML.join('');

    // Re-adiciona o evento do formulário
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
                        const formulaId = formulas[0].idformula || formulas[0].id;
                        const variaveis = await loadVariaveisDaFormula(formulaId);
                        selectTipo.innerHTML = '<option value="">Selecione o Tipo</option>';
                        variaveis.forEach(v => {
                            selectTipo.innerHTML += `<option value="${v.id}">${v.nome}</option>`;
                        });
                    } else {
                        selectTipo.innerHTML = '<option value="">Sem fórmula</option>';
                    }
                } catch (err) {
                    selectTipo.innerHTML = '<option value="">Erro</option>';
                }
            }
        });
    }
}
// ==========================================
// AÇÕES DO USUÁRIO (POST E DELETE)
// ==========================================
async function handleAddNotaSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const materiaId = form.elements['materiaId'].value; 
    const idVariavelReal = form.elements['tipoNota'].value; // Agora o select de tipo guarda o ID da Variavel!
    const valor = form.elements['valor'].value;

    if (!materiaId || !idVariavelReal || !valor) {
        alert('Por favor, preencha todos os campos e selecione um tipo válido.');
        return;
    }

    const valorNum = parseFloat(valor);
    if (valorNum < 0 || valorNum > 10) {
        alert('A nota deve estar entre 0.0 e 10.0');
        return;
    }

    try {
        await createNota({
            idmateria: Number(materiaId), 
            notacadastro: valorNum,
            idvariavel: Number(idVariavelReal) // Envia o ID numérico diretamente
        });
        
        form.reset();
        await renderNotas(CURRENT_USER_ID); // Recarrega para ver a nova média!
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

// ==========================================
// OUVINTES GLOBAIS
// ==========================================
window.addEventListener('materiaAdicionada', async () => {
    if (CURRENT_USER_ID) {
        await renderNotas(CURRENT_USER_ID);
    }
});

window.addEventListener('semestreMudou', async () => {
    if (CURRENT_USER_ID) {
        await renderNotas(CURRENT_USER_ID);
    }
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
export function initNotas(userId) {
    CURRENT_USER_ID = userId;

    const closeButton = document.querySelector('#modal-notas .close_button');
    if (closeButton) closeButton.addEventListener('click', closeNotasModal);

    renderNotas(userId);
    openNotasModal();
}