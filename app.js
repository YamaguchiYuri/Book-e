import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
import { initNotas } from './notas.js';
import { initAgenda } from './agenda.js';
import { initAgendaWidget } from './widgetagenda.js';

const currentUserId = localStorage.getItem('currentUserId');

if (!currentUserId) {
    // Se não houver usuário logado, chuta de volta para o login.
    alert('Você não está logado! Redirecionando...');
    window.location.href = '/login.html';
} else {

    
    initAllWindows();  
    initIcons();       
    
    initAnotacoes(currentUserId);   
    initAgenda(currentUserId);
    initAgendaWidget(currentUserId);
    initNotas(currentUserId); 
    
    console.log(`Aplicativo principal carregado para: ${currentUserId}`);
}