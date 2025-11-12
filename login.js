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
document.getElementById('btnCadastrar').addEventListener('click', function() {
    window.location.href = '/cadastro.html';
});




// logica do login
function loadUsers() {
    const usersJSON = localStorage.getItem('booke_users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

// 1. Seleciona os novos elementos
const form = document.getElementById('login-form');
const inpUsername = document.querySelector("#username");
const inpPassword = document.querySelector("#password");
const aviso = document.querySelector("#aviso");

// 2. Adiciona o "escutador" de envio no formulário
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio
    aviso.innerHTML = ''; // Limpa avisos antigos

    // 3. Pega os valores
    const username = inpUsername.value;
    const password = inpPassword.value;

    if (!username || !password) {
        aviso.innerHTML = 'Preencha usuário e senha.';
        return;
    }

    // 4. Carrega o "banco de dados" de usuários
    const users = loadUsers();

    // 5. Procura pelo usuário
    const foundUser = users.find(user => 
        user.username === username && user.password === password
    );

    // 6. Verifica se o login foi bem-sucedido
    if (foundUser) {
        // SUCESSO!
        alert('Login bem-sucedido! Redirecionando...');
        
        // ** O PASSO MAIS IMPORTANTE **
        // Salva quem está logado para as próximas páginas saberem
        localStorage.setItem('currentUser', foundUser.username);

        // Manda o usuário para a próxima tela
        window.location.href = '/formulario.html'; 
        // (Se o formulário já foi preenchido, mude para /app.html)

    } else {
        // FALHA
        aviso.innerHTML = 'Usuário ou senha incorretos.';
    }
});