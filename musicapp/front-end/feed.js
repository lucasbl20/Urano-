async function createPost() {
  const content = document.getElementById("newPostContent").value.trim();
  const imageInput = document.getElementById("imageInput");
  const userId = localStorage.getItem("userId");  

  if (!userId) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
  }

  if (!content && !imageInput.files[0]) {
      alert("Por favor, adicione texto ou uma imagem à postagem.");
      return;
  }

  const mediaUrl = imageInput.files[0] ? await uploadImage(imageInput.files[0]) : null;

  const postData = {
      userId,
      content,
      mediaUrl,
      type: mediaUrl ? "image" : "text",
  };

  console.log("Dados enviados para o backend:", postData);

  // Obtenha o token JWT do localStorage (ou de onde você o armazena)
  const token = localStorage.getItem("jwtToken"); // Substitua pela chave correta onde você armazena o token

  if (!token) {
      alert("Token de autenticação não encontrado. Faça login novamente.");
      return;
  }

  try {
      const response = await fetch("http://localhost:3002/posts", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,  // Envia o token JWT no cabeçalho
          },
          body: JSON.stringify(postData),
      });

      if (response.ok) {
          const post = await response.json();
          addPostToFeed(post);
          document.getElementById("newPostContent").value = ""; 
          imageInput.value = ""; 
      } else {
          const errorData = await response.json();
          alert(`Erro ao criar postagem: ${errorData.error || "Erro desconhecido"}`);
      }
  } catch (error) {
      console.error("Erro ao criar postagem:", error);
  }
}

async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
      const response = await fetch("http://localhost:3002/upload", {
          method: "POST",
          body: formData,
      });

      if (response.ok) {
          const data = await response.json();
          return data.imageUrl;
      } else {
          console.error("Erro ao enviar imagem.");
          return null;
      }
  } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
  }
}

function addPostToFeed(post) {
  const feed = document.getElementById("feed");

  const postElement = document.createElement("div");
  postElement.classList.add("post");

  const userName = "Usuário"; // O nome do usuário pode ser recuperado de onde você armazenar ou da API

  postElement.innerHTML = `
      <div class="post-header">
          <span class="username">${userName}</span>
          <span class="post-time">${new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <div class="post-content">${post.content}</div>
      ${post.mediaUrl ? `<img src="${post.mediaUrl}" alt="Post Image" class="post-image" onclick="openModal('${post.mediaUrl}')">` : ""}
      <div class="post-actions">
          <button class="like-btn" onclick="likePost('${post._id}')">Curtir</button>
          <button class="comment-btn" onclick="openCommentBox('${post._id}')">Comentar</button>
      </div>
  `;

  feed.prepend(postElement);
}

window.onload = async function loadPosts() {
  try {
      const response = await fetch("http://localhost:3002/posts", {
          headers: {
              "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`, // Envia o token no cabeçalho
          },
      });

      const posts = await response.json();

      // Verifique o que está sendo retornado pela API
      console.log(posts);

      if (Array.isArray(posts)) {
          posts.forEach(addPostToFeed);
      } else {
          console.error("A resposta não é um array de posts", posts);
      }
  } catch (error) {
      console.error("Erro ao carregar postagens:", error);
  }
};
