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
    
    // 1. Salva quem está logado (como antes)
    localStorage.setItem('currentUser', foundUser.username);

    // 2. Pega o ID do usuário que acabou de logar
    const userId = foundUser.username;

    // 3. Monta a "chave" para verificar se o formulário existe
    // (Esta chave é a mesma que o formulario.js vai usar para salvar)
    const formKey = `booke_form_${userId}`; // Ex: 'booke_form_yuri'
    
    // 4. Verifica no localStorage se os dados do formulário já existem
    const formData = localStorage.getItem(formKey);

    // 5. Redirecionamento inteligente
    if (formData) {
        // Se 'formData' NÃO é nulo (ou seja, existe), o usuário já preencheu.
        console.log('Formulário já preenchido. Indo para o app.');
        window.location.href = '/app.html';
    } else {
        // Se 'formData' é nulo, é o primeiro login após o cadastro.
        console.log('Primeiro login. Indo para o formulário.');
        window.location.href = '/formulario.html';
    }

    } else {
    // FALHA
    aviso.innerHTML = 'Usuário ou senha incorretos.';
    }
});