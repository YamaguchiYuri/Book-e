// Importa os "inicializadores" de cada módulo
import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
import { initNotas } from './notas.js'; // (Você vai adicionar este import)

// --- 1. LÓGICA PRINCIPAL DE AUTENTICAÇÃO ---

// Pega o ID do usuário que o login.js salvou
const currentUserId = localStorage.getItem('currentUser');

// --- 2. TRAVA DE SEGURANÇA ---
if (!currentUserId) {
    // Se não houver usuário logado, chuta de volta para o login.
    alert('Você não está logado! Redirecionando...');
    window.location.href = '/login.html';
} else {
    // --- 3. INICIALIZAÇÃO DOS MÓDULOS ---
    // O usuário está logado, podemos carregar o app
    
    // "Liga" os sistemas de UI
    initAllWindows();  
    initIcons();       
    
    // "Liga" os sistemas de DADOS, passando o ID do usuário
    initAnotacoes(currentUserId);   
    initNotas(currentUserId);    // (Você vai ligar o de notas assim também)

    console.log(`Aplicativo principal carregado para: ${currentUserId}`);
}