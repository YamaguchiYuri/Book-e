// O contador de z-index vive aqui agora.
let zIndexCounter = 10;

/**
 * Retorna um novo z-index (o mais alto)
 */
export function getNewZIndex() {
    zIndexCounter++;
    return zIndexCounter;
}

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
        
        // Pega a posição correta (sem "pulo")
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

/**
 * Inicializa todas as janelas principais.
 * Aplica arraste e gerenciamento de z-index.
 */
export function initAllWindows() {
    const allWindows = document.querySelectorAll('.pixel_dialog');
    
    allWindows.forEach(modal => {
        // 1. Aplica o arraste
        makeWindowDraggable(modal);

        // 2. Aplica o clique para trazer à frente
        modal.addEventListener('mousedown', () => {
            modal.style.zIndex = getNewZIndex();
        });
    });
}

/**
 * Inicializa os ícones do desktop e botões de fechar.
 */
export function initIcons() {
    // Lógica de ABRIR janelas
    const icons = document.querySelectorAll('.icon[data-modal-id]');
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const modalId = icon.dataset.modalId;
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.remove('hidden');
                // Traz para frente ao abrir
                modal.style.zIndex = getNewZIndex();
            }
        });
    });

    // Lógica de FECHAR janelas
    const closeButtons = document.querySelectorAll('.close_button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.pixel_dialog');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
}