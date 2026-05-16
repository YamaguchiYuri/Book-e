// js/materias.js

export function initMaterias(userId) {
    const btnAddMateria = document.getElementById('btn-add-materia-app');
    const inputNome = document.getElementById('nome-materia-app');
    const inputCiclo = document.getElementById('ciclo-materia-app');
    const listaUl = document.getElementById('lista-materias-app');

    // Função que será chamada ao clicar em ADICIONAR
    btnAddMateria.addEventListener('click', async () => {
        const nomeMateria = inputNome.value.trim();
        const cicloMateria = Number(inputCiclo.value);

        if (!nomeMateria || !cicloMateria) {
            alert("Preencha o nome e o ciclo da matéria!");
            return;
        }

        // --- AQUI ENTRA A INTEGRAÇÃO COM O JAVA ---
        // Estou aguardando você me confirmar a rota e o DTO para fazermos o fetch!
        console.log(`Pronto para enviar: ${nomeMateria}, ciclo ${cicloMateria} para o user ${userId}`);

        // Simulação visual temporária (só para você ver funcionando no HTML)
        const li = document.createElement('li');
        li.innerHTML = `<span>${nomeMateria} (Ciclo ${cicloMateria})</span> <span style="color:red; cursor:pointer;">X</span>`;
        listaUl.appendChild(li);

        inputNome.value = '';
        inputCiclo.value = '';
    });
}