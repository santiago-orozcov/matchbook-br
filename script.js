// --- CONFIGURACIÓN Y DATOS SIMULADOS ---
const DB_USERS = 'matchbook_users';
const DB_CURRENT_USER = 'matchbook_current_user';
let currentUser = null;

// Datos de Matches Simulados
const simulatedMatches = [
    {
        name: "Ana L.",
        city: "Recife",
        state: "PE",
        offers: ["O Hobbit - Tolkien (Bom)", "1984 - Orwell (Novo)"],
        wants: ["O Senhor dos Anéis - Tolkien"],
        isCompatible: true 
    },
    {
        name: "Túlio M.",
        city: "Olinda",
        state: "PE",
        offers: ["Dom Quixote - Cervantes (Razoável)"],
        wants: ["Harry Potter - Rowling"],
        isCompatible: false 
    }
];

// --- NAVEGACIÓN ---
function mostrarPagina(id) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        // Reset de display manual si fue modificado
        page.style.display = '';
    });

    // Mostrar la página deseada
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        // Forzar flex para mantener diseño
        target.style.display = 'flex'; 
    }

    // Cargar datos específicos si es necesario
    if (id === 'perfil') carregarPerfil();
    if (id === 'meuslivros') carregarMeusLivros();
    if (id === 'editar-perfil') preencherFormularioEdicao();
}

function actualizarInterfazUsuario() {
    if (currentUser && currentUser.name) {
        const el = document.getElementById('user-name');
        if (el) el.textContent = currentUser.name;
    }
}

// --- INICIO ---
window.onload = function() {
    const storedUser = localStorage.getItem(DB_CURRENT_USER);
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        actualizarInterfazUsuario();
        mostrarPagina('principal');
    } else {
        mostrarPagina('inicio');
    }

    // Listeners
    setupForm('form-cadastro', handleCadastro);
    setupForm('form-login', handleLogin);
    setupForm('form-cad-oferecido', handleCadastrarOferecido);
    setupForm('form-cad-desejado', handleCadastrarDesejado);
    setupForm('form-editar-perfil', handleEditarPerfil);
};

function setupForm(id, handler) {
    const form = document.getElementById(id);
    if (form) form.addEventListener('submit', handler);
}

// --- AUTENTICACIÓN ---
function handleCadastro(e) {
    e.preventDefault();
    const email = document.getElementById('cad_email').value;
    const users = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    
    if (users.find(u => u.email === email)) {
        alert("E-mail já cadastrado!");
        mostrarPagina('login');
        return;
    }

    const newUser = {
        name: document.getElementById('cad_nome').value,
        email: email,
        phone: document.getElementById('cad_telefone').value, 
        password: document.getElementById('cad_senha').value,
        city: document.getElementById('cad_cidade').value,
        state: document.getElementById('cad_estado').value,
        livrosOferecidos: [],
        livrosDesejados: []
    };

    users.push(newUser);
    localStorage.setItem(DB_USERS, JSON.stringify(users));
    
    // Auto-login
    loginUser(newUser);
    alert("Conta criada com sucesso!");
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('log_email').value;
    const pass = document.getElementById('log_senha').value;
    const users = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
        loginUser(user);
    } else {
        alert("Dados incorretos.");
    }
}

function loginUser(user) {
    currentUser = user;
    localStorage.setItem(DB_CURRENT_USER, JSON.stringify(user));
    actualizarInterfazUsuario();
    mostrarPagina('principal');
}

function logout() {
    currentUser = null;
    localStorage.removeItem(DB_CURRENT_USER);
    mostrarPagina('inicio');
}

// --- GESTIÓN DE DATOS ---
function salvarDadosUsuario() {
    const users = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem(DB_USERS, JSON.stringify(users));
        localStorage.setItem(DB_CURRENT_USER, JSON.stringify(currentUser));
    }
}

function carregarPerfil() {
    if (!currentUser) return;
    document.getElementById('perfil-info').innerHTML = `
        <p><strong>Nome:</strong> ${currentUser.name}</p>
        <p><strong>E-mail:</strong> ${currentUser.email}</p>
        <p><strong>Telefone:</strong> ${currentUser.phone || '(Não informado)'}</p>
        <p><strong>Local:</strong> ${currentUser.city} - ${currentUser.state}</p>
    `;
}

function preencherFormularioEdicao() {
    if (!currentUser) return;
    document.getElementById('edit_nome').value = currentUser.name;
    document.getElementById('edit_telefone').value = currentUser.phone || ''; 
    document.getElementById('edit_cidade').value = currentUser.city;
    document.getElementById('edit_estado').value = currentUser.state;
}

function handleEditarPerfil(e) {
    e.preventDefault();
    currentUser.name = document.getElementById('edit_nome').value;
    currentUser.phone = document.getElementById('edit_telefone').value; 
    currentUser.city = document.getElementById('edit_cidade').value;
    currentUser.state = document.getElementById('edit_estado').value;
    salvarDadosUsuario();
    alert("Perfil atualizado!");
    mostrarPagina('perfil');
}

// --- LIBROS ---
function carregarMeusLivros() {
    renderLista('livros-ofereco', currentUser.livrosOferecidos, 'oferecido');
    renderLista('livros-quero', currentUser.livrosDesejados, 'desejado');
}

function renderLista(elementId, lista, tipo) {
    const container = document.getElementById(elementId);
    if (!lista || lista.length === 0) {
        container.innerHTML = `<p style="color:#64748b; padding:10px;">Nenhum item cadastrado.</p>`;
        return;
    }
    const html = lista.map((item, idx) => `
        <li>
            <span><strong>${item.titulo}</strong> <small>(${item.autor || '-'})</small></span>
            <button onclick="excluirLivro(${idx}, '${tipo}')" title="Excluir">✕</button>
        </li>
    `).join('');
    container.innerHTML = `<ul>${html}</ul>`;
}

function handleCadastrarOferecido(e) {
    e.preventDefault();
    const livro = {
        titulo: document.getElementById('of_titulo').value,
        autor: document.getElementById('of_autor').value,
        edicao: document.getElementById('of_edicao').value,
        condicao: document.querySelector('input[name="condicao_of"]:checked')?.value || 'N/A'
    };
    currentUser.livrosOferecidos.push(livro);
    salvarDadosUsuario();
    alert("Livro adicionado!");
    e.target.reset();
    mostrarPagina('meuslivros');
}

function handleCadastrarDesejado(e) {
    e.preventDefault();
    const livro = {
        titulo: document.getElementById('de_titulo').value,
        autor: document.getElementById('de_autor').value
    };
    currentUser.livrosDesejados.push(livro);
    salvarDadosUsuario();
    alert("Desejo adicionado!");
    e.target.reset();
    mostrarPagina('meuslivros');
}

function excluirLivro(idx, tipo) {
    if(!confirm("Remover este item?")) return;
    if (tipo === 'oferecido') currentUser.livrosOferecidos.splice(idx, 1);
    else currentUser.livrosDesejados.splice(idx, 1);
    salvarDadosUsuario();
    carregarMeusLivros();
}

// --- MATCH ---
function iniciarBusca() {
    const status = document.getElementById('match-status');
    const card = document.getElementById('match-card');
    const options = document.getElementById('no-match-options');
    const btnVoltar = document.getElementById('btn-voltar-busca');

    mostrarPagina('resultado-match');
    status.textContent = "Buscando leitores compatíveis...";
    card.innerHTML = '<div style="text-align:center; padding:20px;"><div class="icon" style="font-size:3rem;">🔄</div></div>';
    options.style.display = 'none';
    btnVoltar.style.display = 'none';

    setTimeout(() => {
        const match = simulatedMatches.find(m => m.isCompatible);
        if (match) exibirMatch(match);
        else exibirSemMatch();
    }, 2500);
}

function exibirMatch(match) {
    document.getElementById('match-status').textContent = "¡Deu Match!";
    document.getElementById('match-card').innerHTML = `
        <div style="text-align:center; margin-bottom:10px;">
            <div style="font-size:3rem;">🎉</div> <h3 style="color:#0f172a; margin-top:5px;">${match.name}</h3>
            <p style="color:#64748b;">${match.city} - ${match.state}</p>
        </div>
        <div style="background:white; padding:10px; border-radius:8px; margin-bottom:8px;">
            <strong style="font-size:0.9rem;">Oferece:</strong>
            <ul style="margin-left:15px; color:#334155; font-size:0.9rem;">${match.offers.map(o=>`<li>${o}</li>`).join('')}</ul>
        </div>
        <div style="background:white; padding:10px; border-radius:8px;">
            <strong style="font-size:0.9rem;">Deseja:</strong>
            <ul style="margin-left:15px; color:#334155; font-size:0.9rem;">${match.wants.map(w=>`<li>${w}</li>`).join('')}</ul>
        </div>
        <button onclick="alert('Chat simulado iniciado!')" class="btn-primary full-width" style="margin-top:15px;">Iniciar Chat</button>
    `;
    document.getElementById('btn-voltar-busca').style.display = 'block';
}

function exibirSemMatch() {
    document.getElementById('match-status').textContent = "Nenhum match exato";
    document.getElementById('match-card').innerHTML = '';
    document.getElementById('no-match-options').style.display = 'block';
}

function mostrarOpcoesMenosCompativeis() {
    const match = simulatedMatches.find(m => !m.isCompatible);
    document.getElementById('match-status').textContent = "Opção Similar";
    document.getElementById('no-match-options').style.display = 'none';
    
    document.getElementById('match-card').innerHTML = `
        <div style="padding:15px;">
            <h3>${match.name} (Compatibilidade Baixa)</h3>
            <p>${match.city}</p>
            <hr style="margin:10px 0; border:0; border-top:1px solid #e2e8f0;">
            <p>Possui: ${match.offers[0]}</p>
        </div>
    `;
    document.getElementById('btn-voltar-busca').style.display = 'block';
}