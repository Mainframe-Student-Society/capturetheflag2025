from datetime import date
from app.models.user import User
from app import db


class LeaderboardService:
    @staticmethod
    def get_leaderboard():
        leaderboard = User.query.filter(User.score > 0).order_by(User.score.desc(), User.id.asc()).limit(20).all()
        return leaderboard

    @staticmethod
    def get_wlv_leaderboard():
        leaderboard = (
            User.query.filter(
                User.score > 0,
                User.is_student == True,
                User.is_wlv_student == True,
                User.student_id is not None
            )
            .order_by(User.score.desc(), User.id.asc()).limit(20).all()
        )

        return leaderboard
