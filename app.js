import { initAllWindows, initIcons } from './janelas.js';
import { initAnotacoes } from './anotacoes.js';
//import { initNotas } from './notas.js';
import { initAgenda } from './agenda.js'; // <-- ADICIONE ESTE IMPORT

// --- 1. LÓGICA PRINCIPAL DE AUTENTICAÇÃO ---
const currentUserId = localStorage.getItem('currentUser');

// --- 2. TRAVA DE SEGURANÇA ---
if (!currentUserId) {
    // ... (código de redirecionamento)
} else {
    // --- 3. INICIALIZAÇÃO DOS MÓDULOS ---
    
    initAllWindows();  
    initIcons();       
    
    initAnotacoes(currentUserId);   
    //initNotas(currentUserId);
    initAgenda(currentUserId); // <-- ADICIONE ESTA CHAMADA
    
    console.log(`Aplicativo principal carregado para: ${currentUserId}`);
}