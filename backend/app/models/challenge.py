from app import db
from datetime import datetime

class Challenge(db.Model):
    __tablename__ = 'challenges'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    attachment = db.Column(db.String(1000), nullable=False)
    level = db.Column(db.Integer, nullable=False, default=0)
    points = db.Column(db.Integer, nullable=False, default=100)
    solution = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now().astimezone)
    updated_at = db.Column(db.DateTime, default=datetime.now().astimezone, onupdate=datetime.now().astimezone)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'attachment': self.attachment,
            'level': self.level,
            'points': self.points
        }
