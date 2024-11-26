# Exemplo com SQLAlchemy para o Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    album_art = db.Column(db.String(200), nullable=False)  # Caminho para a imagem
    audio_file = db.Column(db.String(200), nullable=False)  # Caminho para o áudio
    likes = db.Column(db.Integer, default=0)  # Contador de curtidas
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Data de criação do post

    def __repr__(self):
        return f"<Post {self.title}>"
