
let zIndexCounter = 10;


export function getNewZIndex() {
    zIndexCounter++;
    return zIndexCounter;
}


function makeWindowDraggable(modalElement) {
    

    const header = modalElement.querySelector('.dialog_header');


    if (header) {
        

        
        let offsetX, offsetY;
        let isDragging = false;

        const startDrag = (e) => {
            e.preventDefault();
            isDragging = true;

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
}


export function initAllWindows() {
    const allWindows = document.querySelectorAll('.pixel_dialog');
    
    allWindows.forEach(modal => {
        makeWindowDraggable(modal);

        modal.addEventListener('mousedown', () => {
            modal.style.zIndex = getNewZIndex();
        });
    });
}

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