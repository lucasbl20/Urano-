const postForm = document.getElementById('post-form');

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const content = document.getElementById('content').value;
  const fileUpload = document.getElementById('file-upload').files[0];
  const type = fileUpload ? 'music' : 'text'; // Se houver arquivo, é música, caso contrário, é ideia

  const formData = new FormData();
  formData.append('content', content);
  formData.append('type', type);
  if (fileUpload) formData.append('file', fileUpload);

  const response = await fetch('/api/posts/create', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  alert(data.message); // Exibe a mensagem de sucesso
});
