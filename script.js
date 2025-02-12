const apiUrl = 'http://localhost:3000/locais'; // URL do JSON Server

document.addEventListener('DOMContentLoaded', () => {
    carregarLocais();
    document.getElementById('botaoADD').addEventListener('click', adicionarLocal);
});

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
    const container = document.createElement('div');
    container.classList.add('lista-locais');
    document.body.appendChild(container);
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

async function adicionarLocal() {
    const titulo = prompt('Digite o título do local:');
    const descricao = prompt('Digite a descrição:');
    const foto = prompt('Digite a URL da foto:');
    
    if (!titulo || !descricao || !foto) return;
    
    const novoLocal = { titulo, descricao, foto };
    
    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoLocal)
        });
        carregarLocais();
    } catch (erro) {
        console.error('Erro ao adicionar local:', erro);
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

async function editarLocal(id) {
    const novoTitulo = prompt('Novo título:');
    const novaDescricao = prompt('Nova descrição:');
    const novaFoto = prompt('Nova URL da foto:');
    
    if (!novoTitulo || !novaDescricao || !novaFoto) return;
    
    const dadosAtualizados = { titulo: novoTitulo, descricao: novaDescricao, foto: novaFoto };
    
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });
        carregarLocais();
    } catch (erro) {
        console.error('Erro ao editar local:', erro);
    }
}
