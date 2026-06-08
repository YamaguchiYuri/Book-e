console.log("🚨 O arquivo formulario.js foi carregado com sucesso!");

// ==========================================
// 1. SELEÇÃO DE ELEMENTOS (Isso que estava faltando!)
// ==========================================
const formPrincipal = document.querySelector('form');
const inpDataNascimento = document.querySelector("#data_nascimento");
const inpFaculdade = document.querySelector("#faculdade");
const inpCurso = document.querySelector("#curso");
const inpCicloFaculdade = document.querySelector("#ciclo_faculdade");
const inpCicloAtual = document.querySelector("#ciclo");

// ==========================================
// 2. FUNÇÃO DE LOGIN
// ==========================================
function getCurrentUserId() {
    const userId = localStorage.getItem('currentUserId');
    
    // CORREÇÃO: Se for nulo, se for o texto 'undefined' ou se não for um número válido, rejeita!
    if (!userId || userId === 'undefined' || isNaN(Number(userId))) {
        alert('Sessão inválida ou usuário não logado. Redirecionando para o Login...');
        localStorage.clear(); // Limpa a sujeira do localStorage
        window.location.href = '/login.html';
        return null;
    }
    return Number(userId);
}

// ==========================================
// 3. ENVIO PARA O BACKEND (Com Rastreador)
// ==========================================
formPrincipal.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("📍 PASSO 1: O botão foi clicado e o form interceptado!");

    const userId = getCurrentUserId();
    console.log("📍 PASSO 2: Pegou o ID do usuário:", userId);
    
    if (!userId) {
        console.log("🛑 PAROU NO PASSO 2: Sem ID de usuário.");
        return;
    }

    console.log("📍 PASSO 3: Data de nascimento lida:", inpDataNascimento.value);
    if (!inpDataNascimento.value) {
        console.log("🛑 PAROU NO PASSO 3: Data de nascimento vazia.");
        alert("Informe sua data de nascimento.");
        return;
    }

    const dto = {
        iduser: userId,
        dt_nasciment_em: inpDataNascimento.value,
        uninome: inpFaculdade.value,
        nomecurso: inpCurso.value,
        semestre: Number(inpCicloFaculdade.value),
        semestreatual: Number(inpCicloAtual.value)
    };

    console.log("📍 PASSO 4: Objeto DTO montado perfeitamente:", dto);

    try {
        const btnSubmit = document.getElementById('btnOk');
        btnSubmit.disabled = true;
        btnSubmit.innerText = "ENVIANDO...";
        console.log("📍 PASSO 5: Indo fazer o fetch no Java...");

        const response = await fetch("http://localhost:8081/api/formulario/enviar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        console.log("📍 PASSO 6: O Java respondeu! Status:", response.status);

        if (!response.ok) {
            const text = await response.text();
            console.log("🛑 ERRO DO JAVA:", text);
            alert("Erro no backend: " + text);
            btnSubmit.disabled = false;
            btnSubmit.innerText = "FINALIZAR FORMULARIO";
            return;
        }

        const resposta = await response.json();
        console.log("📍 PASSO 7: Sucesso! Resposta final:", resposta);
        
        localStorage.setItem('currentIdUniversidadeUsuario', resposta.id_universidade_usuario);

        alert("Formulário enviado com sucesso!");
        window.location.href = "/app.html";

    } catch (error) {
        console.error("🛑 ERRO GRAVE NO FETCH:", error);
        alert("Erro ao enviar formulário. Verifique o console.");
        
        const btnSubmit = document.getElementById('btnOk');
        btnSubmit.disabled = false;
        btnSubmit.innerText = "FINALIZAR FORMULARIO";
    }
});