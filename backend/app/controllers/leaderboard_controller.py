from flask import jsonify
from app.controllers.auth_controller import token_required
from app.services.leaderboard_service import LeaderboardService


class LeaderboardController:
    @staticmethod
    def get_leaderboard():
        leaderboard = LeaderboardService.get_leaderboard()

        return jsonify({
            "message": "Leaderboard retrieved successfully",
            "data": [entry.serialize() for entry in leaderboard]
        }), 200

    @staticmethod
    def get_wlv_leaderboard():
        wlv_leaderboard = LeaderboardService.get_wlv_leaderboard()

        return jsonify({
            "message": "WLv Leaderboard retrieved successfully",
            "data": [entry.serialize() for entry in wlv_leaderboard]
        }), 200
