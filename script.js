const apiUrl = 'http://localhost:3000/locais';

document.addEventListener('DOMContentLoaded', () => {
    carregarLocais();
    document.getElementById('botaoADD').addEventListener('click', abrirModal);
    document.querySelector('.close').addEventListener('click', fecharModal);
    document.getElementById('formLocal').addEventListener('submit', salvarLocal);
});

function abrirModal() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modalTitulo').innerText = 'Adicionar Local';
    document.getElementById('localId').value = '';
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('foto').value = '';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

async function carregarLocais() {
    try {
        const resposta = await fetch(apiUrl);
        const locais = await resposta.json();
        exibirLocais(locais);
    } catch (erro) {
        console.error('Erro ao carregar locais:', erro);
    }
}

function exibirLocais(locais) {
    const container = document.getElementById('listaLocais');
    container.innerHTML = '';
    
    locais.forEach(local => {
        const div = document.createElement('div');
        div.classList.add('local-item');
        div.innerHTML = `
            <h2>${local.titulo}</h2>
            <p>${local.descricao}</p>
            <img src="${local.foto}" alt="Imagem de ${local.titulo}" width="200">
            <button onclick="editarLocal(${local.id})">Editar</button>
            <button onclick="excluirLocal(${local.id})">Excluir</button>
        `;
        container.appendChild(div);
    });
}

async function salvarLocal(event) {
    event.preventDefault();
    
    const id = document.getElementById('localId').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const foto = document.getElementById('foto').value;
    
    const novoLocal = { titulo, descricao, foto };
    
    try {
        if (id) {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Number(id), ...novoLocal })
            });
        } else {
            const resposta = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoLocal)
            });
            const novoItem = await resposta.json();
            document.getElementById('localId').value = novoItem.id;
        }
        fecharModal();
        carregarLocais();
    } catch (erro) {
        console.error('Erro ao salvar local:', erro);
    }
}

async function excluirLocal(id) {
    if (!confirm('Tem certeza que deseja excluir este local?')) return;
    
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        carregarLocais();
    } catch (erro) {
        console.error('Erro ao excluir local:', erro);
    }
}

function editarLocal(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(local => {
            document.getElementById('modal').style.display = 'flex';
            document.getElementById('modalTitulo').innerText = 'Editar Local';
            document.getElementById('localId').value = local.id;
            document.getElementById('titulo').value = local.titulo;
            document.getElementById('descricao').value = local.descricao;
            document.getElementById('foto').value = local.foto;
        });
}
function exibirLocais(locais) {
    const container = document.getElementById('listaLocais');
    container.innerHTML = '';
    
    locais.forEach(local => {
        const div = document.createElement('div');
        div.classList.add('local-item');
        div.innerHTML = `
            <h2>${local.titulo}</h2>
            <p>${local.descricao}</p>
            <img src="${local.foto}" alt="Imagem de ${local.titulo}" width="200">
            <button class="editar" data-id="${local.id}">Editar</button>
            <button class="excluir" data-id="${local.id}">Excluir</button>
        `;
        container.appendChild(div);
    });

    // Adicionando eventos para os botões
    document.querySelectorAll('.editar').forEach(button => {
        button.addEventListener('click', function() {
            editarLocal(this.getAttribute('data-id'));
        });
    });
    document.querySelectorAll('.excluir').forEach(button => {
        button.addEventListener('click', function() {
            excluirLocal(this.getAttribute('data-id'));
        });
    });
}
function editarLocal(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(local => {
            document.getElementById('modal').style.display = 'flex';
            document.getElementById('modalTitulo').innerText = 'Editar Local';
            document.getElementById('localId').value = local.id;
            document.getElementById('titulo').value = local.titulo;
            document.getElementById('descricao').value = local.descricao;
            document.getElementById('foto').value = local.foto;
        })
        .catch(erro => {
            console.error('Erro ao buscar local para edição:', erro);
        });
}
async function excluirLocal(id) {
    if (!confirm('Tem certeza que deseja excluir este local?')) return;

    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        carregarLocais(); // Recarregar os locais após exclusão
    } catch (erro) {
        console.error('Erro ao excluir local:', erro);
    }
}
