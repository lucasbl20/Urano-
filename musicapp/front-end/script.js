// Função para obter o userId do usuário logado
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Presumindo que o usuário esteja salvo no localStorage após o login
  return user ? user._id : null; // Retorna o userId, se disponível
};

// Função para registrar um novo usuário
const registerUser = async () => {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    alert('Nome de usuário, email e senha são obrigatórios.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Usuário registrado com sucesso! Agora, faça login.');
      window.location.href = './login.html'; // Redireciona para a página de login
    } else {
      alert(data.error || 'Erro ao registrar usuário.');
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    alert('Erro ao registrar. Tente novamente mais tarde.');
  }
};

// Função para fazer login do usuário
const loginUser = async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert('Email e senha são obrigatórios.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data)); // Salva o usuário logado no localStorage
      window.location.href = './feed.html'; // Redireciona para a página de feed após o login
    } else {
      console.error('Erro no login:', data.error);
      alert(data.error || 'Email ou senha incorretos.');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Tente novamente mais tarde.');
  }
};

// Função para criar um post
const createPost = async () => {
  const userId = getUserId(); // Obtém o userId do usuário logado
  if (!userId) {
    alert('Você precisa estar logado para criar um post.');
    return;
  }

  const content = document.getElementById('postContent').value.trim();
  const type = 'text'; // Tipo de post (pode ser alterado para 'image' se necessário)

  if (!content) {
    alert('O conteúdo do post não pode estar vazio.');
    return;
  }

  const postData = { userId, content, type };

  try {
    const response = await fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Post criado com sucesso!');
      document.getElementById('postContent').value = ''; // Limpar o campo de texto
      loadPosts(); // Recarregar o feed com o novo post
    } else {
      alert(`Erro: ${data.error || 'Não foi possível criar o post.'}`);
    }
  } catch (error) {
    console.error('Erro ao criar o post:', error);
    alert('Erro ao criar o post. Tente novamente mais tarde.');
  }
};

// Função para carregar o feed de posts
const loadPosts = async () => {
  const userId = getUserId();
  if (!userId) {
    alert('Você precisa estar logado para visualizar o feed.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/posts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Posts carregados:', data);
      // Renderizar os posts no feed
      const feedContainer = document.getElementById('feedContainer');
      feedContainer.innerHTML = ''; // Limpa o conteúdo atual do feed
      data.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <p><strong>Usuário:</strong> ${post.userId.username || 'Anônimo'}</p>
          <p>${post.content}</p>
          <p><small>${new Date(post.createdAt).toLocaleString()}</small></p>
        `;
        feedContainer.appendChild(postElement);
      });
    } else {
      alert('Erro ao carregar o feed.');
    }
  } catch (error) {
    console.error('Erro ao carregar o feed:', error);
    alert('Erro ao carregar o feed. Tente novamente mais tarde.');
  }
};

// Eventos
document.getElementById('registerForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  registerUser();
});

document.getElementById('loginForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  loginUser();
});

document.addEventListener('DOMContentLoaded', () => {
  const postButton = document.getElementById('postButton');
  if (postButton) {
    postButton.addEventListener('click', createPost);
  }

  loadPosts(); // Carregar posts do feed ao carregar a página
});
