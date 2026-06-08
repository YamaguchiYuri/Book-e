// js/materias.js

export function initMaterias(userId) {
    const btnAddMateria = document.getElementById('btn-add-materia-app');
    const inputNome = document.getElementById('nome-materia-app');
    const inputCiclo = document.getElementById('ciclo-materia-app');
    const inputFormula = document.getElementById('formula-materia-app'); // Novo input
    const listaUl = document.getElementById('lista-materias-app');

    const adicionarMateriaNaTela = (idMateria, nome, ciclo) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '4px';
        li.style.padding = '4px 8px';
        li.style.backgroundColor = '#b3d2ff';
        li.style.border = '2px solid #94add3';
        li.style.color = '#ffffff';

        li.innerHTML = `
            <span>${nome} (Ciclo ${ciclo})</span> 
            <span class="btn-del-materia" data-id="${idMateria}" style="color:#ff5555; cursor:pointer; font-weight:bold; position:static;">[X]</span>
        `;
        listaUl.appendChild(li);
    };

    const carregarMaterias = async () => {
        try {
            listaUl.innerHTML = '<li>Carregando matérias...</li>';
            const response = await fetch(`http://localhost:8081/api/materias/buscar/${userId}`);

            if (response.status === 404) {
                listaUl.innerHTML = ''; 
                return;
            }

            if (!response.ok) throw new Error("Erro ao carregar do servidor.");

            const materias = await response.json();
            listaUl.innerHTML = ''; 

            materias.forEach(materia => {
                const ciclo = materia.semestre_materia || materia.semestremateria;
                adicionarMateriaNaTela(materia.idmateria, materia.nomemateria, ciclo);
            });

        } catch (error) {
            console.error("Erro ao carregar matérias:", error);
            listaUl.innerHTML = '<li style="color:red;">Erro ao carregar matérias.</li>';
        }
    };

    // Lógica de 2 etapas (POST Materia -> POST Formula)
    btnAddMateria.addEventListener('click', async () => {
        const nomeMateria = inputNome.value.trim();
        const cicloMateria = Number(inputCiclo.value);
        const textoFormula = inputFormula.value.trim();

        if (!nomeMateria || !cicloMateria || !textoFormula) {
            alert("Preencha o nome, o ciclo e a fórmula da matéria!");
            return;
        }

        const idUniUsuario = Number(localStorage.getItem('currentIdUniversidadeUsuario')); 

        if (!idUniUsuario) {
            alert("Erro: ID da universidade não encontrado. Faça login novamente.");
            return;
        }

        const payloadMateria = {
            semestremateria: cicloMateria,
            nomemateria: nomeMateria,
            iduniversidadeusuario: idUniUsuario
        };

        try {
            btnAddMateria.disabled = true;
            btnAddMateria.innerText = "SALVANDO...";

            // 1. Cria a Matéria
            const responseMateria = await fetch("http://localhost:8081/api/materias/criar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadMateria)
            });

            if (!responseMateria.ok) throw new Error("Erro ao criar a matéria.");
            const novaMateriaSalva = await responseMateria.json();

            // 2. Cria a Fórmula usando o ID da matéria recém-criada
            const payloadFormula = {
                expressao: textoFormula,
                idmateria: novaMateriaSalva.idmateria
            };

            const responseFormula = await fetch("http://localhost:8081/api/formulas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadFormula)
            });

            if (!responseFormula.ok) {
                // Se a fórmula falhar, avisamos, mas a matéria já existe
                alert("Matéria criada, mas houve um erro ao registrar a fórmula.");
            }

            // Adiciona na tela
            const ciclo = novaMateriaSalva.semestre_materia || novaMateriaSalva.semestremateria;
            adicionarMateriaNaTela(novaMateriaSalva.idmateria, novaMateriaSalva.nomemateria, ciclo);

            // Limpa os campos
            inputNome.value = '';
            inputCiclo.value = '';
            inputFormula.value = '';

            window.dispatchEvent(new Event('materiaAdicionada'));

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Falha ao salvar: " + error.message);
        } finally {
            btnAddMateria.disabled = false;
            btnAddMateria.innerText = "ADICIONAR";
        }
    });

    listaUl.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-del-materia')) {
            const idMateria = e.target.getAttribute('data-id');
            const nomeMateriaText = e.target.previousElementSibling.textContent;

            const confirmar = confirm(`Deseja realmente excluir a matéria:\n${nomeMateriaText}?`);
            if (!confirmar) return;

            try {
                const response = await fetch(`http://localhost:8081/api/materias/${idMateria}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(await response.text());

                e.target.closest('li').remove();
                window.dispatchEvent(new Event('materiaAdicionada'));
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Erro ao excluir matéria: " + error.message);
            }
        }
    });

    carregarMaterias();
}