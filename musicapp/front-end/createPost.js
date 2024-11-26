const form = document.getElementById("postForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = document.getElementById("content").value; 
  const mediaUrl = document.getElementById("mediaUrl").value; 
  const userId = localStorage.getItem("userId");

  if (!content) {
    alert("O conteúdo do post não pode estar vazio.");
    return;
  }

  if (!userId) {
    alert("Você precisa estar logado para criar um post.");
    return;
  }

  const postData = {
    userId,
    content,
    mediaUrl,
    type: mediaUrl ? "image" : "text"
  };

  try {
    const response = await fetch("http://localhost:3002/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const post = await response.json();
      console.log("Post criado:", post);
      window.location.href = "/feed.html";
    } else {
      const error = await response.json();
      console.log("Erro ao criar post:", error);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
});
