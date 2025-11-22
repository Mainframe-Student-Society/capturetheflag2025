from flask import Blueprint, request, current_app, send_from_directory
from app.controllers.challenge_controller import ChallengeController
import os

bp = Blueprint('challenge', __name__, url_prefix='/challenges')

@bp.route('', methods=['GET'])
def get_challenges():
    return ChallengeController.get_challenges()

@bp.route('/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    return ChallengeController.get_challenge(challenge_id)

@bp.route('', methods=['POST'])
def create_challenge():
    return ChallengeController.create_challenge(request)

@bp.route('/<int:challenge_id>/submit', methods=['POST'])
def submit_challenge(challenge_id):
    return ChallengeController.submit_challenge(challenge_id, request.json)

@bp.route('/download/<name>', methods=['GET'])
def download_file(name):
    upload_folder = os.path.join(current_app.root_path, 'uploads')
    return send_from_directory(upload_folder, name, as_attachment=True)

@bp.route('/<int:challenge_id>', methods=['DELETE'])
def delete_challenge(challenge_id):
    return ChallengeController.delete_challenge(challenge_id)
