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

form.addEventListener('submit', async (event) => { 
    event.preventDefault(); 

    const email = inpEmail.value;
    const username = inpUsername.value;
    const password = inpPassword.value;
    const confirme = inpConfirme.value;

    // 2. Validação do Front-end (você já tinha, está ótimo)
    if (!email || !username || !password || !confirme) {
        aviso.innerHTML = 'Todos os campos são obrigatórios.';
        return; 
    }
    if (password !== confirme) {
        aviso.innerHTML = 'As senhas não conferem.';
        return; 
    }
    if (password.length < 8) {
        aviso.innerHTML = 'A senha deve ter no mínimo 8 caracteres.';
        return; 
    }


    const userData = {
        nickname_user: username,
        email: email,
        passwordkey_user: password 
    };


    try {
        const response = await fetch('http://localhost:8081/api/usuarios/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });


        if (response.status === 201) { 

            const novoUsuario = await response.json();
            console.log('Sucesso:', novoUsuario);
            alert('Usuário cadastrado com sucesso! Redirecionando para o login...');
            window.location.href = '/login.html';
        
        } else {

            const errorText = await response.text();
            aviso.innerHTML = `Erro: ${errorText || 'Não foi possível cadastrar'}`;
        }

    } catch (error) {
 
        console.error('Erro na requisição:', error);
        aviso.innerHTML = 'Não foi possível conectar ao servidor.';
    }
});

