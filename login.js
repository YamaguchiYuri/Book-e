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




const form = document.getElementById('login-form');
const inpUsername = document.querySelector("#username");
const inpPassword = document.querySelector("#password");
const aviso = document.querySelector("#aviso");



form.addEventListener('submit', async (event) => { 
    event.preventDefault(); // Impede o envio
    aviso.innerHTML = ''; // Limpa avisos antigos


    const username = inpUsername.value;
    const password = inpPassword.value;

    if (!username || !password) {
        aviso.innerHTML = 'Preencha usuário e senha.';
        return;
    }

    const loginData = {
        nickname_user: username,
        passwordkey_user: password
    };

    // 6. Chama seu NOVO endpoint /login
    try {
        const response = await fetch('http://localhost:8081/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) { 

            const usuario = await response.json(); 
            alert('Login bem-sucedido! Redirecionando...');

          
            // Salva o NOME (para o 'app.js' usar)
            localStorage.setItem('currentUser', usuario.nickname_user); 
            // Salva o ID (para o 'formulario.js' usar)
            localStorage.setItem('currentUserId', usuario.id_user); 


            if (usuario.dt_nasciment_em) {

                window.location.href = '/app.html';
            } else {
     
                window.location.href = '/formulario.html';
            }

        } else {
  
            const errorText = await response.text();
            aviso.innerHTML = errorText || 'Usuário ou senha incorretos.';
        }

    } catch (error) {
   
        console.error('Erro na requisição:', error);
        aviso.innerHTML = 'Não foi possível conectar ao servidor.';
    }
});