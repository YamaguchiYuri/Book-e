import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
import { initNotas } from './notas.js';
import { initAgenda } from './agenda.js'; 
import { initMaterias } from './materias.js';
import { initAgendaWidget, renderAgendaWidget } from './widgetagenda.js'; 

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

    initAgenda(currentUserIdNum, renderAgendaWidget); 
    
    initAgendaWidget(currentUserIdNum);
    initWidgetSemestre();
    
    console.log(`Aplicativo principal carregado para: ${currentUserId}`);
}

function initWidgetSemestre() {
    const btnVoltar = document.getElementById('btn-semestre-voltar');
    const btnAvancar = document.getElementById('btn-semestre-avancar');
    const displaySemestre = document.getElementById('display-semestre');

    const semestreMaximo = Number(localStorage.getItem('totalSemestres')) || 10; 
    let semestreVisualizado = Number(localStorage.getItem('semestreAtual')) || 1;

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