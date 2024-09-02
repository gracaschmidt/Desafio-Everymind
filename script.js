const apiUrl = 'http://localhost:3000/produtos';

// Função para carregar os produtos
async function loadProducts() {
    const response = await fetch(apiUrl);
    const produtos = await response.json();
    const tbody = document.querySelector('#produtosTable tbody');
    tbody.innerHTML = '';
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.codigo}</td>
            <td>${produto.descricao}</td>
            <td>${produto.preco}</td>
            <td>
                <button onclick="editProduct(${produto.id})">Editar</button>
                <button onclick="deleteProduct(${produto.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para criar ou editar um produto
document.querySelector('#produtoForm').addEventListener('submit', async event => {
    event.preventDefault();
    const id = document.querySelector('#produtoId').value;
    const nome = document.querySelector('#nome').value;
    const codigo = document.querySelector('#codigo').value;
    const descricao = document.querySelector('#descricao').value;
    const preco = document.querySelector('#preco').value;

    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, codigo, descricao, preco })
        });
    } else {
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, codigo, descricao, preco })
        });
    }

    document.querySelector('#produtoForm').reset();
    document.querySelector('#produtoId').value = '';
    loadProducts();
});

// Função para editar um produto
async function editProduct(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const produto = await response.json();
    document.querySelector('#produtoId').value = produto.id;
    document.querySelector('#nome').value = produto.nome;
    document.querySelector('#codigo').value = produto.codigo;
    document.querySelector('#descricao').value = produto.descricao;
    document.querySelector('#preco').value = produto.preco;
}

// Função para deletar um produto
async function deleteProduct(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadProducts();
}

// Carregar produtos na inicialização
loadProducts();
