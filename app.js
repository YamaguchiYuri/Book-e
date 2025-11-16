import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
//import { initNotas } from './notas.js';
import { initAgenda } from './agenda.js';
import { initAgendaWidget } from './widgetagenda.js';


const currentUserId = localStorage.getItem('currentUser');


if (!currentUserId) {

} else {

    
    initAllWindows();  
    initIcons();       
    
    initAnotacoes(currentUserId);   
    initAgenda(currentUserId);
    initAgendaWidget(currentUserId);
    console.log(`Aplicativo principal carregado para: ${currentUserId}`);
}