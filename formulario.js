// janela modal
const dialogWindow = document.querySelector('.pixel_dialog');
const dialogHeader = document.querySelector('.dialog_header');

let offsetX, offsetY;

const startDrag = (e) => {

    e.preventDefault();

    offsetX = e.clientX - dialogWindow.offsetLeft;
    offsetY = e.clientY - dialogWindow.offsetTop;


    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
}


const doDrag = (e) => {

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;


    dialogWindow.style.left = newLeft + 'px';
    dialogWindow.style.top = newTop + 'px';
}


const stopDrag = () => {

    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
}


dialogHeader.addEventListener('mousedown', startDrag);
//fim da janelinha

// --- INÍCIO DO CÓDIGO DO MODAL DE MATÉRIAS ---

// Array para guardar as matérias
let materiasArray = [];

// Selecionar elementos do formulário principal
const btnAbrirModal = document.getElementById('btnMateria');

// Selecionar elementos do modal
const modalOverlay = document.getElementById('modal-overlay');
const modalMaterias = document.getElementById('modal-materias');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnAddLista = document.getElementById('btn-add-lista');
const inputNomeMateria = document.getElementById('nome-materia');
const listaMateriasUL = document.getElementById('lista-materias');
const closeModalX = document.getElementById('close-modal');

// --- Funções para abrir e fechar o modal ---
const abrirModal = () => {
    modalOverlay.classList.remove('hidden');
    modalMaterias.classList.remove('hidden');
}

const fecharModal = () => {
    modalOverlay.classList.add('hidden');
    modalMaterias.classList.add('hidden');
}

// --- Função para adicionar matéria na lista ---
const adicionarMateriaNaLista = () => {
    const nomeMateria = inputNomeMateria.value;
    
    // Só adiciona se o campo não estiver vazio
    if (nomeMateria.trim() === '') {
        alert('Por favor, digite o nome da matéria.');
        return;
    }

    // 1. Adiciona no array
    materiasArray.push(nomeMateria);

    // 2. Adiciona na lista visual (UL)
    const novoItemLi = document.createElement('li');
    novoItemLi.textContent = nomeMateria;
    listaMateriasUL.appendChild(novoItemLi);

    // 3. Limpa o input e foca nele novamente
    inputNomeMateria.value = '';
    inputNomeMateria.focus();

    // Opcional: Você pode salvar esse array em um input escondido no form principal
    // const inputEscondido = document.getElementById('id_do_input_escondido');
    // inputEscondido.value = JSON.stringify(materiasArray);
}

// --- Adicionar os "escutadores" de evento ---
btnAbrirModal.addEventListener('click', abrirModal);
btnFecharModal.addEventListener('click', fecharModal);
closeModalX.addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', fecharModal); // Fecha o modal se clicar fora
btnAddLista.addEventListener('click', adicionarMateriaNaLista);

//salvar infos
// 1. Seleciona o formulário principal e os inputs
const formPrincipal = document.querySelector('form');
const inpDataNascimento = document.querySelector("#data_nascimento");
const inpFaculdade = document.querySelector("#faculdade");
const inpCurso = document.querySelector("#curso");
const inpCicloFaculdade = document.querySelector("#ciclo_faculdade");
const inpCiclo = document.querySelector("#ciclo");

/**
 * Pega o nome de usuário (ID) que foi salvo no login.
 * @returns {string | null} O nome do usuário ou null se não estiver logado.
 */
function getCurrentUserId() {
    const userId = localStorage.getItem('currentUser');
    if (!userId) {
        // Se, por algum motivo, ninguém estiver logado,
        // envia de volta para a tela de login.
        alert('Erro: Usuário não logado. Redirecionando...');
        window.location.href = '/login.html';
        return null;
    }
    return userId; // ex: 'yuri'
}

// 3. Adiciona o "escutador" para o envio do formulário
formPrincipal.addEventListener('submit', (event) => {
    // Impede o envio padrão do HTML
    event.preventDefault(); 
    
    const userId = getCurrentUserId();
    if (!userId) return; // Para a execução se não houver usuário

    // --- A. Salva os dados do formulário ---
    // Nós criamos um objeto com os dados principais
    const dadosFormulario = {
        data_nascimento: inpDataNascimento.value,
        faculdade: inpFaculdade.value,
        curso: inpCurso.value,
        total_ciclos: inpCicloFaculdade.value,
        ciclo_atual: inpCiclo.value
    };
    
    // Cria uma chave de "banco de dados" ÚNICA para este usuário
    // Exemplo: 'booke_form_yuri'
    const formKey = `booke_form_${userId}`;
    
    // Salva os dados do formulário no localStorage
    localStorage.setItem(formKey, JSON.stringify(dadosFormulario));

    
    // --- B. Salva o Array de Matérias ---
    // (O array 'materiasArray' já foi preenchido pelo seu modal!)
    
    // Exemplo: 'booke_materias_yuri'
    const materiasKey = `booke_materias_${userId}`; 
    
    // Salva o array de matérias no localStorage
    localStorage.setItem(materiasKey, JSON.stringify(materiasArray));

    
    // --- C. Finaliza e Redireciona ---
    alert('Dados do formulário salvos com sucesso!');
    
    // Envia o usuário para a tela principal do app
    window.location.href = '/app.html';
});