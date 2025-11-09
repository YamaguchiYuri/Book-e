/**
 * Salva dados no localStorage (converte para JSON).
 * @param {string} key A chave para salvar.
 * @param {any} data O dado para salvar.
 */
export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Carrega dados do localStorage (converte de JSON).
 * @param {string} key A chave para carregar.
 * @returns {any} O dado ou um array vazio se não existir.
 */
export function loadData(key) {
    const data = localStorage.getItem(key);
    // Retorna um array vazio por padrão se for para listas
    return data ? JSON.parse(data) : []; 
}