from flask import jsonify
from app.controllers.auth_controller import token_required
from app.services.challenge_service import ChallengeService

class ChallengeController:
    @staticmethod
    @token_required
    def get_challenges(user, token):
        challenges, completed = ChallengeService.get_challenges(user)

        return jsonify({
            "message": "Challenges retrieved successfully",
            "data": {
                "available": [challenge.serialize() for challenge in challenges],
                "completed": [challenge.serialize() for challenge in completed]
            }
        })

    @staticmethod
    @token_required
    def get_challenge(user, token, challenge_id):
        challenge = ChallengeService.get_challenge(user, challenge_id)

        if challenge:
            return jsonify({
                "message": "Challenge retrieved successfully",
                "data": challenge.serialize()
            }), 200

        return jsonify({"error": "Challenge not found"}), 404

    @staticmethod
    @token_required
    def create_challenge(user, token, data):
        if not user.is_admin:
            return jsonify({"error": "Unauthorized"}), 403

        if not data or 'title' not in data or 'description' not in data or 'level' not in data or 'points' not in data or 'solution' not in data:
            return jsonify({"error": "Invalid data"}), 400

        challenge, error = ChallengeService.create_challenge(data)

        if challenge:
            return jsonify({
                "message": "Challenge created successfully",
                "data": challenge.serialize()
            }), 201

        return jsonify({"error": error}), 400

    @staticmethod
    @token_required
    def submit_challenge(user, token, challenge_id, data):
        if not data or 'solution' not in data:
            return jsonify({"error": "Invalid data"}), 400

        success, error = ChallengeService.submit_challenge(user, challenge_id, data['solution'])

        if success:
            return jsonify({"message": "Challenge submitted successfully"}), 200

        return jsonify({"error": error}), 400
