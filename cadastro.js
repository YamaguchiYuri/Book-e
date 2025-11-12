const inpEmail = document.querySelector("#email");
const inpUsername = document.querySelector("#username");
const inpPassword = document.querySelector("#password");
const inpConfirme = document.querySelector("#confirme");
const inpTodos = document.querySelectorAll('form input');
const aviso = document.querySelector("#aviso");
const btnVoltar = document.getElementById('btnVoltar');
const form = document.querySelector('form');

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
    event.preventDefault(); // Impede o envio do formulário

    // 1. Pega todos os valores dos inputs
    const email = inpEmail.value;
    const username = inpUsername.value;
    const password = inpPassword.value;
    const confirme = inpConfirme.value;

    // 2. Validação dos campos
    if (!email || !username || !password || !confirme) {
        aviso.innerHTML = 'Todos os campos são obrigatórios.';
        return; // Para a execução
    }

    if (password !== confirme) {
        aviso.innerHTML = 'As senhas não conferem.';
        return; // Para a execução
    }

    if (password.length < 8) {
        aviso.innerHTML = 'A senha deve ter no mínimo 8 caracteres.';
        return; // Para a execução
    }

    // 3. Carrega os usuários existentes
    const users = loadUsers();

    // 4. Verifica se o usuário ou email já existem
    const userExists = users.find(user => user.username === username || user.email === email);

    if (userExists) {
        aviso.innerHTML = 'Usuário ou email já cadastrado.';
        return; // Para a execução
    }

    // 5. Se tudo estiver OK, cria o novo usuário
    const newUser = {
        id: Date.now(), // Um ID único simples
        email: email,
        username: username,
        password: password // Nota: Em app real, não salvaríamos a senha assim :)
    };

    // 6. Adiciona o novo usuário à lista e salva
    users.push(newUser);
    saveUsers(users);

    // 7. Sucesso e redirecionamento (como seu código já fazia)
    alert('Usuário cadastrado com sucesso! Redirecionando para o login...');
    window.location.href = '/login.html';
});


 //Carrega a lista de todos os usuários do localStorage

function loadUsers() {
    const usersJSON = localStorage.getItem('booke_users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

 //Salva a lista de usuários no localStorage.
function saveUsers(usersArray) {
    localStorage.setItem('booke_users', JSON.stringify(usersArray));
}