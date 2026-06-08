export function initMaterias(userId) {
    const btnAddMateria = document.getElementById('btn-add-materia-app');
    const inputNome = document.getElementById('nome-materia-app');
    const inputCiclo = document.getElementById('ciclo-materia-app');
    const inputFormula = document.getElementById('formula-materia-app');
    const inputAprovacao = document.getElementById('aprovacao-materia-app');
    const inputLimiteFaltas = document.getElementById('limite-faltas-app');
    const listaUl = document.getElementById('lista-materias-app');

    const API = "http://localhost:8081/api";

    async function getUniversidadeUsuarioId() {
        const res = await fetch(`${API}/universidadeUsuario/usuario/${userId}`);

        if (!res.ok) throw new Error("Falha ao buscar universidade_usuario");

        const data = await res.json();

        const obj = Array.isArray(data) ? data[0] : data;

        const id =
            obj?.iduniversidadeusuario ??
            obj?.idUniversidadeUsuario ??
            obj?.id_universidade_usuario ??
            obj?.id;

        if (!id) throw new Error("Sem vínculo de universidade_usuario");

        return id;
    }

    function extrairIdMateria(obj) {
        return obj?.idmateria ?? obj?.idMateria ?? obj?.id ?? null;
    }

    const adicionarMateriaNaTela = (id, nome, ciclo) => {
        const li = document.createElement("li");

        Object.assign(li.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
            padding: "4px 8px",
            backgroundColor: "#b3d2ff",
            border: "2px solid #94add3",
            color: "#fff"
        });

        li.innerHTML = `
            <span>${nome} (Ciclo ${ciclo})</span>
            <span class="btn-del-materia" data-id="${id}" style="cursor:pointer;color:#ff5555;font-weight:bold;">[X]</span>
        `;

        listaUl.appendChild(li);
    };

    const carregarMaterias = async () => {
        try {
            const res = await fetch(`${API}/materias/buscar/${userId}`);

            if (res.status === 404) {
                listaUl.innerHTML = "";
                return;
            }

            if (!res.ok) throw new Error("Erro ao carregar matérias");

            const materias = await res.json();

            listaUl.innerHTML = "";

            materias.forEach(m => {
                const id = extrairIdMateria(m);
                if (!id) return;

                const ciclo = m.semestre_materia ?? m.semestremateria;
                adicionarMateriaNaTela(id, m.nomemateria, ciclo);
            });

        } catch (err) {
            console.error(err);
            listaUl.innerHTML = "<li style='color:red;'>Erro ao carregar</li>";
        }
    };

    btnAddMateria.addEventListener("click", async () => {
        const nome = inputNome.value.trim();
        const ciclo = Number(inputCiclo.value);
        const formula = inputFormula.value.trim();
        const aprovacao = Number(inputAprovacao.value);
        const limiteFaltas = Number(inputLimiteFaltas.value);

        if (!nome || !ciclo || !formula || aprovacao <= 0 || limiteFaltas <= 0) {
            alert("Preencha corretamente os campos");
            return;
        }

        let idUniUsuario;

        try {
            idUniUsuario = await getUniversidadeUsuarioId();
        } catch (err) {
            alert(err.message);
            return;
        }

        try {
            btnAddMateria.disabled = true;
            btnAddMateria.innerText = "SALVANDO...";

            const resMateria = await fetch(`${API}/materias/criar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomemateria: nome,
                    semestremateria: ciclo,
                    aprovacao,
                    iduniversidadeusuario: idUniUsuario
                })
            });

            const text = await resMateria.text();

            if (!resMateria.ok) {
                throw new Error(text || "Erro ao criar matéria");
            }

            const materia = JSON.parse(text);

            const idMateria = extrairIdMateria(materia);

            if (!idMateria) {
                throw new Error("idmateria não retornado pelo backend");
            }

            await fetch(`${API}/formulas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expressao: formula,
                    idmateria: idMateria
                })
            });

            await fetch(`${API}/faltas/criar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idmateria: idMateria,
                    numfaltas: 0,
                    limitefaltas: limiteFaltas
                })
            });

            adicionarMateriaNaTela(idMateria, nome, ciclo);

            inputNome.value = "";
            inputCiclo.value = "";
            inputFormula.value = "";
            inputAprovacao.value = "";
            inputLimiteFaltas.value = "";

        } catch (err) {
            console.error(err);
            alert("Erro ao salvar: " + err.message);
        } finally {
            btnAddMateria.disabled = false;
            btnAddMateria.innerText = "ADICIONAR";
        }
    });

    listaUl.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("btn-del-materia")) return;

        const id = e.target.dataset.id;

        try {
            const res = await fetch(`${API}/materias/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error(await res.text());

            e.target.closest("li").remove();

        } catch (err) {
            alert("Erro ao excluir: " + err.message);
        }
    });

    carregarMaterias();
}