// Função para alterar a capa do perfil
function changeCoverPhoto() {
    const coverInput = document.getElementById("coverInput");
    coverInput.click(); // Abre o seletor de arquivos
}

// Função para alterar a foto de perfil
function changeProfilePhoto() {
    const profileInput = document.getElementById("profileInput");
    profileInput.click(); // Abre o seletor de arquivos
}

// Função para editar a bio
function editBio() {
    const bio = document.getElementById("userBio");
    const bioInput = document.getElementById("bioInput");
    const saveButton = document.getElementById("saveBioButton");

    bio.style.display = "none";
    bioInput.style.display = "block";
    saveButton.style.display = "block";
    bioInput.value = bio.textContent.trim(); // Carregar a bio atual no campo de texto
}

// Função para salvar a nova bio
function saveBio() {
    const bioInput = document.getElementById("bioInput");
    const bio = document.getElementById("userBio");

    bio.textContent = bioInput.value.trim(); // Atualiza a bio com o novo valor
    bio.style.display = "block";
    bioInput.style.display = "none";
    document.getElementById("saveBioButton").style.display = "none";

    // Aqui você pode enviar a nova bio para o servidor, por exemplo:
    // saveBioToServer(bioInput.value);
}

// Função para enviar foto de capa para o servidor
document.getElementById("coverInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("coverPhoto", file);

        try {
            const response = await fetch("http://localhost:5000/uploadCoverPhoto", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById("coverImage").src = data.imageUrl;  // Atualiza a capa com a nova imagem
            } else {
                alert("Erro ao carregar a foto de capa.");
            }
        } catch (error) {
            alert("Erro ao enviar a foto de capa.");
        }
    }
});

// Função para enviar foto de perfil para o servidor
document.getElementById("profileInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("profilePhoto", file);

        try {
            const response = await fetch("http://localhost:5000/uploadProfilePhoto", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById("profileImage").src = data.imageUrl;  // Atualiza a foto de perfil com a nova imagem
            } else {
                alert("Erro ao carregar a foto de perfil.");
            }
        } catch (error) {
            alert("Erro ao enviar a foto de perfil.");
        }
    }
});

// Função para carregar postagens do usuário
async function loadUserPosts() {
    const userId = localStorage.getItem("userId");  // Recupera o ID do usuário logado
    const response = await fetch(`http://localhost:5000/posts/${userId}`);
    if (response.ok) {
        const posts = await response.json();
        const postsContainer = document.getElementById("userPosts");

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("user-post");

            postElement.innerHTML = `
                <div class="post-content">
                    <p>${post.content}</p>
                    ${post.mediaUrl ? `<img src="${post.mediaUrl}" alt="Post Image" class="post-image">` : ""}
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    } else {
        alert("Erro ao carregar as postagens.");
    }
}

// Carregar as postagens quando a página for carregada
window.onload = loadUserPosts;
