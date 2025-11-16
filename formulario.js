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
// fim da janelinha



// --- INÍCIO DO CÓDIGO DO MODAL DE MATÉRIAS ---
let materiasArray = [];

const btnAbrirModal = document.getElementById('btnMateria');

const modalOverlay = document.getElementById('modal-overlay');
const modalMaterias = document.getElementById('modal-materias');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnAddLista = document.getElementById('btn-add-lista');
const inputNomeMateria = document.getElementById('nome-materia');
const listaMateriasUL = document.getElementById('lista-materias');
const closeModalX = document.getElementById('close-modal');

const abrirModal = () => {
    modalOverlay.classList.remove('hidden');
    modalMaterias.classList.remove('hidden');
}

const fecharModal = () => {
    modalOverlay.classList.add('hidden');
    modalMaterias.classList.add('hidden');
}

const adicionarMateriaNaLista = () => {
    const nomeMateria = inputNomeMateria.value;

    if (nomeMateria.trim() === '') {
        alert('Por favor, digite o nome da matéria.');
        return;
    }

    materiasArray.push(nomeMateria);

    const novoItemLi = document.createElement('li');
    novoItemLi.textContent = nomeMateria;
    listaMateriasUL.appendChild(novoItemLi);

    inputNomeMateria.value = '';
    inputNomeMateria.focus();
}

btnAbrirModal.addEventListener('click', abrirModal);
btnFecharModal.addEventListener('click', fecharModal);
closeModalX.addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', fecharModal);
btnAddLista.addEventListener('click', adicionarMateriaNaLista);



// --- FORMULÁRIO PRINCIPAL ---
const formPrincipal = document.querySelector('form');
const inpDataNascimento = document.querySelector("#data_nascimento");
const inpFaculdade = document.querySelector("#faculdade");
const inpCurso = document.querySelector("#curso");
const inpCicloFaculdade = document.querySelector("#ciclo_faculdade");
const inpCiclo = document.querySelector("#ciclo");

// AQUI ARRUMA para usar o id correto salvo no login
function getCurrentUserId() {
    const userId = localStorage.getItem('currentUserId'); // CORRETO
    if (!userId) {
        alert('Erro: Usuário não logado. Redirecionando...');
        window.location.href = '/login.html';
        return null;
    }
    return userId;
}



// --- ENVIO DO FORMULÁRIO PARA O BACKEND ---
formPrincipal.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = getCurrentUserId();
    if (!userId) return;

    // monta DTO exatamente como o backend pede
    const dto = {
        id_user: Number(userId),
        dt_nasciment_em: inpDataNascimento.value,
        uni_nome: inpFaculdade.value,
        nome_curso: inpCurso.value,
        semestre: Number(inpCicloFaculdade.value),
        materias: materiasArray.map(nome => ({
            nome_materia: nome,
            semestre_materia: Number(inpCiclo.value)
        }))
    };

    console.log("Enviando DTO:");
    console.log(dto);

    try {
        const response = await fetch("http://localhost:8081/api/formulario/enviar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (!response.ok) {
            const text = await response.text();
            alert("Erro no backend: " + text);
            return;
        }

        const resposta = await response.json();
        console.log("Resposta do backend:", resposta);

        alert("Formulário enviado com sucesso!");
        window.location.href = "/app.html";

    } catch (error) {
        console.error(error);
        alert("Erro ao enviar formulário");
    }
});