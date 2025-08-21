const inpEmail = document.querySelector("#email");
const inpUsername = document.querySelector("#username");
const inpPassword = document.querySelector("#password");
const inpConfirme = document.querySelector("#confirme");
const inpTodos = document.querySelectorAll('form input');
const aviso = document.querySelector("#aviso");

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


