from flask import Blueprint, request
from app.controllers.leaderboard_controller import LeaderboardController

bp = Blueprint('leaderboard', __name__, url_prefix='/leaderboard')

@bp.route('', methods=['GET'])
def get_leaderboard():
    return LeaderboardController.get_leaderboard()

@bp.route('/wlv', methods=['GET'])
def get_wlv_leaderboard():
    return LeaderboardController.get_wlv_leaderboard()
