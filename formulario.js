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