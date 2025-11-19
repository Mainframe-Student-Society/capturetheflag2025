from flask import Blueprint, request
from app.controllers.challenge_controller import ChallengeController

bp = Blueprint('challenge', __name__, url_prefix='/challenges')

@bp.route('', methods=['GET'])
def get_challenges():
    return ChallengeController.get_challenges()

@bp.route('/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    return ChallengeController.get_challenge(challenge_id)

@bp.route('', methods=['POST'])
def create_challenge():
    return ChallengeController.create_challenge(request.json)

@bp.route('/<int:challenge_id>/submit', methods=['POST'])
def submit_challenge(challenge_id):
    return ChallengeController.submit_challenge(challenge_id, request.json)
