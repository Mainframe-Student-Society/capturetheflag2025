from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(256), nullable=False)
    is_student = db.Column(db.Boolean, nullable=False, default=True)
    is_wlv_student = db.Column(db.Boolean, nullable=False, default=True)
    student_id = db.Column(db.String(10), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now().astimezone)
    updated_at = db.Column(db.DateTime, default=datetime.now().astimezone, onupdate=datetime.now().astimezone)
    deleted_at = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        self.password = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
        }
