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
        nicknameuser: username,
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
                    

                    localStorage.setItem('currentUser', usuario.nicknameuser); 
                    localStorage.setItem('currentUserId', usuario.iduser); 


                    try {
                        const urlBuscaUni = `http://localhost:8081/api/universidadeUsuario/usuario/${usuario.iduser}`;
                        const responseUni = await fetch(urlBuscaUni);
                        
                        if (responseUni.ok) {
                            const dadosUni = await responseUni.json();
                            console.log(" JSON devolvido pelo Java (Universidade):", dadosUni);
                            
                           
                            const objUniversidade = Array.isArray(dadosUni) ? dadosUni[0] : dadosUni;

                            const idUniUser = objUniversidade?.iduniversidadeusuario || objUniversidade?.id_universidade_usuario;

                            if (idUniUser) {
                                localStorage.setItem('currentIdUniversidadeUsuario', idUniUser);
                                console.log("ID da Universidade salvo no LocalStorage:", idUniUser);
                            } else {
                                alert("Aperta F12 e olha o Console!");
                            }

                        } else {
                            console.log("Usuário logado, mas o Java retornou status 404 (Sem universidade).");
                        }
                    } catch (err) {
                        console.error("Erro ao tentar buscar os dados da universidade:", err);
                    }
                    // ==============================================================

                    // 3. Redirecionamento original
                    // Adicionei um pequeno delay de meio segundo para dar tempo do LocalStorage gravar tudo com calma
                    setTimeout(() => {
                        if (usuario.dt_nasciment_em) {
                            window.location.href = '/app.html';
                        } else {
                            window.location.href = '/formulario.html';
                        }
                    }, 500);
                }

         else {
  
            const errorText = await response.text();
            aviso.innerHTML = errorText || 'Usuário ou senha incorretos.';
        }

    } catch (error) {
   
        console.error('Erro na requisição:', error);
        aviso.innerHTML = 'Não foi possível conectar ao servidor.';
    }
});