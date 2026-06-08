import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
import { initNotas } from './notas.js';
import { initAgenda } from './agenda.js'; 
import { initMaterias } from './materias.js';
import { initConfig } from './config.js';
import { initAgendaWidget, renderAgendaWidget } from './widgetagenda.js'; 
const USUARIO_API_URL = 'http://localhost:8081/api/usuarios';
const CURSO_API_URL = 'http://localhost:8081/api/cursos';
const UNIVERSIDADE_USUARIO_API_URL = 'http://localhost:8081/api/universidadeUsuario';

const currentUserId = localStorage.getItem('currentUser'); 
const currentUserIdNum = localStorage.getItem('currentUserId');

if (!currentUserIdNum) { 
    alert('Você não está logado! Redirecionando...');
    window.location.href = '/login.html';
} else {
    initAllWindows();  
    initIcons();       

    initAnotacoes(currentUserIdNum);   
    initNotas(currentUserIdNum);     
    initMaterias(currentUserIdNum);

    initConfig();

    initAgenda(currentUserIdNum, renderAgendaWidget); 
    
    initAgendaWidget(currentUserIdNum);
    initWidgetSemestre();
    
    console.log(`Aplicativo principal carregado para: ${currentUserId}`);
}


async function buscarUsuario(id) {
    const response = await fetch(`${USUARIO_API_URL}/buscar?id=${id}`);
    return await response.json();
}

async function buscarCurso(id) {
    const response = await fetch(`${CURSO_API_URL}/buscar?id=${id}`);
    return await response.json();
}

async function buscarUniversidadeUsuario(idUser) {
    const response = await fetch(`${UNIVERSIDADE_USUARIO_API_URL}/usuario/${idUser}`);
    return await response.json();
}

async function initWidgetSemestre() {
    const btnVoltar = document.getElementById('btn-semestre-voltar');
    const btnAvancar = document.getElementById('btn-semestre-avancar');
    const displaySemestre = document.getElementById('display-semestre');
const usuario = await buscarUsuario(currentUserIdNum);

const semestreAtual = Number(usuario.semestreatual) || 1;

const universidadeUsuario = await buscarUniversidadeUsuario(currentUserIdNum);

if (!universidadeUsuario || universidadeUsuario.length === 0) {
    console.error('Usuário sem curso vinculado');
    return;
}

const idCurso = universidadeUsuario[0].id_curso;

const curso = await buscarCurso(idCurso);

const semestreMaximo = Number(curso.semestre) || 1;

let semestreVisualizado = semestreAtual;

console.log({
    semestreAtual,
    semestreMaximo,
    idCurso
});

localStorage.setItem('semestreAtual', semestreAtual);
localStorage.setItem('semestreVisualizado', semestreAtual);
localStorage.setItem('totalSemestres', semestreMaximo);

    localStorage.setItem('semestreVisualizado', semestreVisualizado);

    const atualizarDisplay = () => {
        displaySemestre.innerText = `CICLO ${semestreVisualizado}`;
        localStorage.setItem('semestreVisualizado', semestreVisualizado);
        window.dispatchEvent(new Event('semestreMudou'));
    };

    btnVoltar.addEventListener('click', () => {
        if (semestreVisualizado > 1) {
            semestreVisualizado--;
            atualizarDisplay();
        }
    });

    btnAvancar.addEventListener('click', () => {
        if (semestreVisualizado < semestreMaximo) {
            semestreVisualizado++;
            atualizarDisplay();
        }
    });

    atualizarDisplay();
}