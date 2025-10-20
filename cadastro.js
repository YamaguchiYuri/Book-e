const inpEmail = document.querySelector("#email");
const inpUsername = document.querySelector("#username");
const inpPassword = document.querySelector("#password");
const inpConfirme = document.querySelector("#confirme");
const inpTodos = document.querySelectorAll('form input');
const aviso = document.querySelector("#aviso");
const btnVoltar = document.getElementById('btnVoltar');
const form = document.querySelector('form');

// --- CÓDIGO PARA TORNAR A JANELA ARRASTÁVEL ---

// 1. Seleciona os elementos
const dialogWindow = document.querySelector('.pixel_dialog');
const dialogHeader = document.querySelector('.dialog_header');

// Variáveis para guardar a posição do clique
let offsetX, offsetY;

// 2. Função que é chamada quando o mouse é pressionado no header
const startDrag = (e) => {
    // Previne seleção de texto indesejada
    e.preventDefault();

    // Calcula a posição do clique *dentro* da janela
    // Posição do mouse na tela - Posição da janela na tela
    offsetX = e.clientX - dialogWindow.offsetLeft;
    offsetY = e.clientY - dialogWindow.offsetTop;

    // Adiciona os "escutadores" de movimento e de soltar o mouse
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
}

// 3. Função que é chamada enquanto o mouse é movido
const doDrag = (e) => {
    // Calcula a nova posição da janela
    // Posição do mouse na tela - Posição inicial do clique
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Aplica a nova posição à janela
    dialogWindow.style.left = newLeft + 'px';
    dialogWindow.style.top = newTop + 'px';
}

// 4. Função que é chamada quando o mouse é solto
const stopDrag = () => {
    // Remove os "escutadores" para parar de arrastar
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// 5. Inicia tudo: adiciona o "escutador" de clique no header
dialogHeader.addEventListener('mousedown', startDrag);


btnVoltar.addEventListener('click', (evt)=>{
    evt.preventDefault();
    window.location.href='/login.html';
})

const avisos = {
    username:"Apenas Letras e Numeros",
    email:"Email valido e unico",
    password:"No minimo 8 caracteres",
    confirme:"Repita a mesma senha"
};

const mostrarAviso = (evt)=>{
    const inpSelecionado = evt.target;
    const inpId = inpSelecionado.id;
    const avisoSelecionado = avisos[inpId];
    aviso.innerHTML = avisoSelecionado;
}

const limparAviso = ()=>{
    aviso.innerHTML = '';
}


inpTodos.forEach(function(inp){
    inp.addEventListener('focus', mostrarAviso);
    inp.addEventListener('blur', limparAviso);
});


//Teste de cadastro

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const userData = {
        email: inpEmail.value,
        username: inpUsername.value,
        password: inpPassword.value
    };

    // Envia a requisição POST para o json-server
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sucesso:', data); // Mostra a resposta do servidor falso
        alert('Usuário cadastrado com sucesso no servidor de teste!');
        window.location.href = '/login.html';
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao tentar cadastrar.');
    });
});