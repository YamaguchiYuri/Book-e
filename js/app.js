import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
import { initNotas } from './notas.js';
import { initAgenda } from './agenda.js'; 


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
    

    initAgenda(currentUserIdNum, renderAgendaWidget); 
    
    initAgendaWidget(currentUserIdNum);
    
    console.log(`Aplicativo principal carregado para: ${currentUserId}`);
}