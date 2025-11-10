import { loadData } from './storage.js';

// Chave do localStorage onde as matérias do formulário foram salvas
const MATERIAS_STORAGE_KEY = 'booke-materias';

// Seletor da lista no HTML
const listaMateriasUI = document.getElementById('lista-materias-notas');

/**
 * Carrega as matérias do storage e as exibe na tela.
 */
function renderMateriasList() {
    // 1. Carrega os dados (esperando um array de strings)
    const materias = loadData(MATERIAS_STORAGE_KEY);
    
    // Limpa a lista antes de adicionar
    listaMateriasUI.innerHTML = '';

    if (materias.length === 0) {
        listaMateriasUI.innerHTML = '<p style="color:white;">Você ainda não adicionou matérias no seu formulário.</p>';
        return;
    }

    // 2. Cria o HTML para cada matéria e adiciona na lista
    materias.forEach(nomeDaMateria => {
        const li = document.createElement('li');
        li.className = 'materia-item';

        li.innerHTML = `
            <span>${nomeDaMateria}</span>
            <button class="btn btn-abrir-materia" data-materia-nome="${nomeDaMateria}">
                Abrir
            </button>
        `;
        
        listaMateriasUI.appendChild(li);
    });

    // 3. Adiciona os "escutadores" de clique nos botões "Abrir"
    listaMateriasUI.querySelectorAll('.btn-abrir-materia').forEach(button => {
        button.addEventListener('click', handleAbrirMateria);
    });
}

/**
 * Função chamada quando o usuário clica em "Abrir".
 * (Por enquanto, só mostra um log)
 */
function handleAbrirMateria(e) {
    const nomeMateria = e.target.dataset.materiaNome;
    console.log('Abrindo a matéria:', nomeMateria);
    
    // O próximo passo seria abrir um novo modal
    // para esta matéria específica.
}


/**
 * Função principal que inicializa o módulo de Notas.
 */
export function initNotas() {
    // Carrega e exibe a lista assim que o app inicia
    renderMateriasList();

    console.log("Módulo de Notas Inicializado.");
}