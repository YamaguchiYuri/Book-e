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

    // ✔️ Agora o DTO fica IGUAL ao exemplo do Postman
    const dto = {
        id_user: userId,
        dt_nasciment_em: inpDataNascimento.value,
        uni_nome: inpFaculdade.value,
        nome_curso: inpCurso.value,
        semestre: Number(inpCicloFaculdade.value)
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
        localStorage.setItem('currentIdUniversidadeUsuario', resposta.id_universidade_usuario);

        alert("Formulário enviado com sucesso!");
        window.location.href = "/app.html";

    } catch (error) {
        console.error(error);
        alert("Erro ao enviar formulário");
    }
});
