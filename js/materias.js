// js/materias.js

export function initMaterias(userId) {
    const btnAddMateria = document.getElementById('btn-add-materia-app');
    const inputNome = document.getElementById('nome-materia-app');
    const inputCiclo = document.getElementById('ciclo-materia-app');
    const listaUl = document.getElementById('lista-materias-app');

    // 1. Função para criar a linha (<li>) na interface
    const adicionarMateriaNaTela = (nome, ciclo) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${nome} (Ciclo ${ciclo})</span> 
            <span class="delete-materia-btn" style="color:#ff5555; cursor:pointer;">X</span>
        `;
        listaUl.appendChild(li);
    };

    // 2. NOVA FUNÇÃO: Buscar as matérias do Java quando o app abre
    const carregarMaterias = async () => {
        try {
            // Limpa a lista antes de carregar (evita duplicar se chamar a função de novo)
            listaUl.innerHTML = '<li>Carregando matérias...</li>';

            // Faz o GET na rota que você confirmou no Controller
            const response = await fetch(`http://localhost:8081/api/materias/buscar/${userId}`);

            // Se voltar 404, significa apenas que a lista está vazia (conforme seu Java)
            if (response.status === 404) {
                listaUl.innerHTML = ''; // Deixa a lista em branco
                console.log("Nenhuma matéria encontrada para este usuário.");
                return;
            }

            if (!response.ok) {
                throw new Error("Erro ao carregar do servidor.");
            }

            // Pega a lista de MateriaFullResponseDto
            const materias = await response.json();
            listaUl.innerHTML = ''; // Limpa o "Carregando..."

            // Para cada matéria no JSON, adiciona na tela usando os nomes exatos do DTO
            materias.forEach(materia => {
                adicionarMateriaNaTela(materia.nome_materia, materia.semestre_materia);
            });

        } catch (error) {
            console.error("Erro ao carregar matérias:", error);
            listaUl.innerHTML = '<li>Erro ao carregar matérias.</li>';
        }
    };

    // 3. Evento de clique para adicionar a matéria no Java (POST)
    btnAddMateria.addEventListener('click', async () => {
        const nomeMateria = inputNome.value.trim();
        const cicloMateria = Number(inputCiclo.value);

        if (!nomeMateria || !cicloMateria) {
            alert("Preencha o nome e o ciclo da matéria!");
            return;
        }

        const idUniUsuario = Number(localStorage.getItem('currentIdUniversidadeUsuario')); 

        if (!idUniUsuario) {
            alert("Erro: ID da universidade não encontrado no sistema. Faça login novamente.");
            return;
        }

        const payload = {
            semestre_materia: cicloMateria,
            nome_materia: nomeMateria,
            id_universidade_usuario: idUniUsuario
        };

        try {
            btnAddMateria.disabled = true;
            btnAddMateria.innerText = "SALVANDO...";

            const response = await fetch("http://localhost:8081/api/materias/criar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Erro desconhecido no servidor.");
            }

            // Adiciona visualmente na lista do app imediatamente após o sucesso
            adicionarMateriaNaTela(nomeMateria, cicloMateria);

            inputNome.value = '';
            inputCiclo.value = '';

        } catch (error) {
            console.error("Erro ao salvar matéria:", error);
            alert("Falha ao salvar a matéria: " + error.message);
        } finally {
            btnAddMateria.disabled = false;
            btnAddMateria.innerText = "ADICIONAR";
        }
    });

    // 4. Executa o carregamento assim que o módulo (janela) é inicializado
    carregarMaterias();
}