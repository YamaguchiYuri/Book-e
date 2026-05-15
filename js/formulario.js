// --- MODAL DE MATÉRIAS ---
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
    const nomeMateria = inputNomeMateria.value.trim();
    const semestreMateria = Number(document.querySelector("#ciclo").value);

    if (nomeMateria === '') {
        alert('Digite o nome da matéria.');
        return;
    }

    if (!semestreMateria) {
        alert('Selecione o ciclo da matéria.');
        return;
    }

    const materiaObj = {
        nome_materia: nomeMateria,
        semestre_materia: semestreMateria
    };

 
    materiasArray.push(materiaObj);


    renderMateriasList(); 


    inputNomeMateria.value = '';
    inputNomeMateria.focus();
}
function renderMateriasList() {
    listaMateriasUL.innerHTML = ''; 

    materiasArray.forEach((materia, index) => {
        const novoItemLi = document.createElement('li');
        
        // X e texto
        novoItemLi.innerHTML = `
            ${materia.nome_materia} (sem. ${materia.semestre_materia})
            <button class="delete-materia-btn" data-index="${index}">X</button>
        `;
        
        listaMateriasUL.appendChild(novoItemLi);
    });

    // deletar
    listaMateriasUL.querySelectorAll('.delete-materia-btn').forEach(button => {
        button.addEventListener('click', handleDeleteMateria);
    });
}
function handleDeleteMateria(event) {
    const indexToRemove = Number(event.target.dataset.index);
    
    // Remove o item do array
    materiasArray.splice(indexToRemove, 1);
    
    // Re-renderiza a lista inteira com os novos índices
    renderMateriasList();
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

// ✔️ Pega ID salvo no login
function getCurrentUserId() {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
        alert('Usuário não logado. Redirecionando...');
        window.location.href = '/login.html';
        return null;
    }
    return Number(userId);
}


// --- ENVIO PARA O BACKEND ---
formPrincipal.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = getCurrentUserId();
    if (!userId) return;

    if (!inpDataNascimento.value) {
        alert("Informe sua data de nascimento.");
        return;
    }

    if (materiasArray.length === 0) {
        alert("Adicione pelo menos uma matéria.");
        return;
    }

    // ✔️ Agora o DTO fica IGUAL ao exemplo do Postman
    const dto = {
        id_user: userId,
        dt_nasciment_em: inpDataNascimento.value,
        uni_nome: inpFaculdade.value,
        nome_curso: inpCurso.value,
        semestre: Number(inpCicloFaculdade.value),
        materias: materiasArray
    };

    console.log("DTO enviado ao backend:", dto);

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
