//Confirmaçao se o usuairo esta logado
const userId = localStorage.getItem('currentUser');

if (!userId) {
    alert('Você precisa estar logado para ver esta página.');
    window.location.href = '/login.html';
}

// Importa os "inicializadores" de cada módulo
import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
import { initNotas} from './notas.js'
// (No futuro, você adicionará mais imports aqui)
// import { initAgenda } from './agenda.js'; 

// --- Executa os inicializadores direto ---
// (Não precisa do DOMContentLoaded, pois type="module" já faz isso)

// "Liga" os sistemas
initNotas();
initAllWindows();  // Prepara todas as janelas para arrastar
initIcons();       // Prepara todos os ícones para abrir
initAnotacoes();   // Prepara a lógica interna da janela de notas

console.log("Aplicativo principal carregado.");
