export async function initConfig() {

    console.log('CONFIG INICIADO');
    
    const API_URL = 'http://localhost:8081/api/usuarios';

    const inpNickname = document.querySelector('#config-nickname');
    const inpNascimento = document.querySelector('#config-nascimento');
    const inpSemestre = document.querySelector('#config-semestre');

    const btnSalvar = document.querySelector('#btnSalvarConfig');
    const btnLogout = document.querySelector('#btnLogout');

    const currentUserId = localStorage.getItem('currentUserId');

    if (!currentUserId) {
        window.location.href = '/login.html';
        return;
    }

    if (
        !inpNickname ||
        !inpNascimento ||
        !inpSemestre ||
        !btnSalvar ||
        !btnLogout
    ) {
        console.error('Elementos da tela de configuração não encontrados');
        return;
    }

    /* ==========================
       CARREGAR USUÁRIO
    ========================== */

    async function carregarUsuario() {

        try {

            const response = await fetch(
                `${API_URL}/buscar?id=${currentUserId}`
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar usuário');
            }

            const usuario = await response.json();

            inpNickname.value = usuario.nicknameuser || '';
            inpNascimento.value = usuario.dt_nasciment_em || '';
            inpSemestre.value = usuario.semestreatual || '';

            console.log('Usuário carregado:', usuario);

        } catch (error) {

            console.error(error);
            alert('Erro ao carregar usuário');

        }
    }

    /* ==========================
       SALVAR
    ========================== */

    btnSalvar.addEventListener('click', async () => {

        const dadosAtualizados = {

            nicknameuser: inpNickname.value,
            dt_nasciment_em: inpNascimento.value,
            semestreatual: String(inpSemestre.value)

        };

        try {

            const response = await fetch(
                `${API_URL}/${currentUserId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosAtualizados)
                }
            );

            if (response.ok) {

                localStorage.setItem(
                    'currentUser',
                    inpNickname.value
                );

                localStorage.setItem(
                    'semestreAtual',
                    inpSemestre.value
                );

                localStorage.setItem(
                    'semestreVisualizado',
                    inpSemestre.value
                );

                alert('Dados atualizados com sucesso!');

                window.dispatchEvent(
                    new Event('semestreMudou')
                );

            } else {

                const erro = await response.text();

                console.error(erro);
                alert(`Erro: ${erro}`);

            }

        } catch (error) {

            console.error(error);
            alert('Erro ao atualizar usuário');

        }

    });

    /* ==========================
       LOGOUT
    ========================== */

    btnLogout.addEventListener('click', () => {

        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('semestreAtual');
        localStorage.removeItem('semestreVisualizado');
        localStorage.removeItem('totalSemestres');

        window.location.href = '/login.html';

    });

    /* ==========================
       INICIAR
    ========================== */

    await carregarUsuario();

}