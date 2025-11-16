
import { loadData, saveData } from './storage.js';


let MATERIAS_API_ENDPOINT = ''; 
let NOTAS_API_ENDPOINT = '';   


const notasListArea = document.getElementById('notas-list-area');




function loadMaterias() {
    return loadData(MATERIAS_API_ENDPOINT); // Chama GET no endpoint
}


function saveNota(notaDto) {

    return saveData(NOTAS_API_ENDPOINT, notaDto, 'POST');
}


function calculateMedia(notas) {

    const p1 = parseFloat(notas.find(n => n.tipo_nota === 'P1')?.nota_cadastro) || 0;
    const p2 = parseFloat(notas.find(n => n.tipo_nota === 'P2')?.nota_cadastro) || 0;
    const a1 = parseFloat(notas.find(n => n.tipo_nota === 'A1')?.nota_cadastro) || 0;
    const a2 = parseFloat(notas.find(n => n.tipo_nota === 'A2')?.nota_cadastro) || 0;

    const media = (p1 + p2 + a1 + a2) / 4;
    return media;
}


function updateMateriaStatus(materiaId) {
    const card = notasListArea.querySelector(`.materia-card[data-materia-id="${materiaId}"]`);
    if (!card) return;

    const statusEl = card.querySelector('.materia-header span');

    const grades = {
        P1: parseFloat(card.querySelector('input[data-tipo="P1"]').value) || 0,
        P2: parseFloat(card.querySelector('input[data-tipo="P2"]').value) || 0,
        A1: parseFloat(card.querySelector('input[data-tipo="A1"]').value) || 0,
        A2: parseFloat(card.querySelector('input[data-tipo="A2"]').value) || 0
    };
    
    const media = (grades.P1 + grades.P2 + grades.A1 + grades.A2) / 4;
    const statusText = `Média: ${media.toFixed(1)}`;

    if (media >= 6.0) {
        statusEl.textContent = `${statusText} (Aprovado)`;
        statusEl.className = 'status-aprovado';
    } else {
        statusEl.textContent = `${statusText} (Reprovado)`;
        statusEl.className = 'status-reprovado';
    }
}


async function renderNotas() {
    notasListArea.innerHTML = '<p style="color:white;">Carregando matérias...</p>';
    
    let materias;
    try {

        materias = await loadMaterias();
    } catch (error) {
        notasListArea.innerHTML = `<p style="color:red;">Erro ao carregar matérias: ${error.message}</p>`;
        return;
    }

    notasListArea.innerHTML = ''; 

    if (materias.length === 0) {
        notasListArea.innerHTML = '<p style="color:white;">Nenhuma matéria encontrada. (Verifique o formulário)</p>';
        return;
    }


    materias.forEach(materia => {
        const media = calculateMedia(materia.notas); 
        
        let statusClass = 'status-neutro';
        let statusText = `Média: ${media.toFixed(1)}`;
        
        if (materia.notas.length > 0) { 
            if (media >= 6.0) {
                statusClass = 'status-aprovado';
                statusText += ' (Aprovado)';
            } else {
                statusClass = 'status-reprovado';
                statusText += ' (Reprovado)';
            }
        }

        const li = document.createElement('li');
        li.className = 'materia-card';
 
        li.dataset.materiaId = materia.id_materia; 

      
        const getNotaVal = (tipo) => materia.notas.find(n => n.tipo_nota === tipo)?.nota_cadastro || '';

        li.innerHTML = `
            <div class="materia-header">
                <h3>${materia.nome_materia}</h3>
                <span class="${statusClass}">${statusText}</span>
            </div>
            <div class="materia-inputs">
                <div class="input-group">
                    <label>Prova 1</label>
                    <input type="number" min="0" max="10" step="0.1" 
                           value="${getNotaVal('P1')}" 
                           data-materia-id="${materia.id_materia}" data-tipo="P1">
                </div>
                <div class="input-group">
                    <label>Prova 2</label>
                    <input type="number" min="0" max="10" step="0.1" 
                           value="${getNotaVal('P2')}" 
                           data-materia-id="${materia.id_materia}" data-tipo="P2">
                </div>
                <div class="input-group">
                    <label>Ativ. 1</label>
                    <input type="number" min="0" max="10" step="0.1" 
                           value="${getNotaVal('A1')}" 
                           data-materia-id="${materia.id_materia}" data-tipo="A1">
                </div>
                <div class="input-group">
                    <label>Ativ. 2</label>
                    <input type="number" min="0" max="10" step="0.1" 
                           value="${getNotaVal('A2')}" 
                           data-materia-id="${materia.id_materia}" data-tipo="A2">
                </div>
            </div>
        `;
        notasListArea.appendChild(li);
    });


    // 'change': salva quando o usuário sai do campo
    notasListArea.querySelectorAll('.materia-inputs input').forEach(input => {
        input.addEventListener('change', handleGradeChange);
    });
}

/**
 * Chamado quando o usuário MUDA um campo de nota e sai dele
 */
async function handleGradeChange(e) {
    const input = e.target;
    const materiaId = input.dataset.materiaId;
    const tipoNota = input.dataset.tipo; // "P1", "P2", "A1", "A2"
    let valor = input.value;


    if (parseFloat(valor) > 10) valor = '10';
    if (parseFloat(valor) < 0) valor = '0';
    input.value = valor; 


    const notaDto = {
        id_materia: materiaId,
        tipo_nota: tipoNota,
        nota_cadastro: parseFloat(valor)
    };

    try {
  
        await saveNota(notaDto);
        

        updateMateriaStatus(materiaId);

    } catch (error) {
        alert(`Erro ao salvar nota: ${error.message}`);

    }
}


export function initNotas(userId) {

    MATERIAS_API_ENDPOINT = `/materias/usuario/${userId}`;
    NOTAS_API_ENDPOINT = `/notas`; // Endpoint de "Upsert"
    

    renderNotas();
    
    console.log(`Módulo de Notas Inicializado para ${userId}.`);
}