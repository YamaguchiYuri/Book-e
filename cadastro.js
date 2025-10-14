const inpEmail = document.querySelector("#email");
const inpUsername = document.querySelector("#username");
const inpPassword = document.querySelector("#password");
const inpConfirme = document.querySelector("#confirme");
const inpTodos = document.querySelectorAll('form input');
const aviso = document.querySelector("#aviso");
const btnVoltar = document.getElementById('btnVoltar');
const form = document.querySelector('form');

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