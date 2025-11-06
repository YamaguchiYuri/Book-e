// app.js

// --- NÍVEL 1: ABRIR E FECHAR AS JANELAS ---
// Funciona perfeitamente com seus novos ícones

const icons = document.querySelectorAll('.icon[data-modal-id]');

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        // Pega o ID do 'data-modal-id' (ex: "modal-anotacoes")
        const modalId = icon.dataset.modalId;
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.remove('hidden');
        }
    });
});

// Pega TODOS os botões de fechar
const closeButtons = document.querySelectorAll('.close_button');

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Encontra a janela pai (.pixel_dialog) do botão e a esconde
        const modal = button.closest('.pixel_dialog');
        if (modal) {
            modal.classList.add('hidden');
        }
    });
});


// --- NÍVEL 2: TORNAR TODAS AS JANELAS ARRASTÁVEIS ---
// Esta função é aplicada a TODAS as janelas
// (Vem do seu formulario.js original)

/**
 * Aplica a lógica de arrastar a uma janela de modal específica.
 * @param {HTMLElement} modalElement - O elemento .pixel_dialog
 */
function makeWindowDraggable(modalElement) {
    const header = modalElement.querySelector('.dialog_header');
    let offsetX, offsetY;
    let isDragging = false;

    const startDrag = (e) => {
        e.preventDefault();
        isDragging = true;

        // Correção para o "pulo" da centralização
        if (modalElement.style.transform !== 'none') {
            const rect = modalElement.getBoundingClientRect();
            modalElement.style.left = rect.left + 'px';
            modalElement.style.top = rect.top + 'px';
            modalElement.style.transform = 'none'; 
        }

        offsetX = e.clientX - modalElement.offsetLeft;
        offsetY = e.clientY - modalElement.offsetTop;

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    const doDrag = (e) => {
        if (!isDragging) return;
        modalElement.style.left = (e.clientX - offsetX) + 'px';
        modalElement.style.top = (e.clientY - offsetY) + 'px';
    }

    const stopDrag = () => {
        isDragging = false;
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
    }

    header.addEventListener('mousedown', startDrag);
}

// Pega TODAS as janelas e aplica a função
const allWindows = document.querySelectorAll('.pixel_dialog');
allWindows.forEach(makeWindowDraggable);


// --- NÍVEL 3 (BÔNUS): GERENCIAR Z-INDEX (CLIQUE PARA TRAZER PRA FRENTE) ---
let zIndexCounter = 10; // Começa acima do conteúdo normal

allWindows.forEach(modal => {
    modal.addEventListener('mousedown', () => {
        // Quando clicar em qualquer parte da janela, aumenta o z-index
        zIndexCounter++;
        modal.style.zIndex = zIndexCounter;
    });
});