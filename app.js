// app.js (VERSÃO CORRIGIDA E SIMPLIFICADA)

// Importa os "inicializadores" de cada módulo
import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
// (No futuro, você adicionará mais imports aqui)
// import { initAgenda } from './agenda.js'; 

// --- Executa os inicializadores direto ---
// (Não precisa do DOMContentLoaded, pois type="module" já faz isso)

// "Liga" os sistemas
initAllWindows();  // Prepara todas as janelas para arrastar
initIcons();       // Prepara todos os ícones para abrir
initAnotacoes();   // Prepara a lógica interna da janela de notas
// initAgenda();    // (Você ligaria sua agenda aqui no futuro)

console.log("Aplicativo principal carregado.");