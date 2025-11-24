from flask import jsonify, current_app, url_for
from app.controllers.auth_controller import token_required
from app.services.challenge_service import ChallengeService
from werkzeug.utils import secure_filename
import os


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

        if not data or 'title' not in data.form or 'description' not in data.form or 'level' not in data.form or 'points' not in data.form or 'solution' not in data.form:
            return jsonify({"error": "Invalid data"}), 400

        if not 'attachment' in data.files or data.files['attachment'].filename == '':
            return jsonify({"error": "No attachment provided"}), 400

        file = data.files['attachment']
        filename = file.filename

        if '.' in filename and filename.rsplit('.', 1)[1].lower() in {'txt', 'py', 'zip'}:
            filename = secure_filename(file.filename)
            upload_folder = os.path.join(current_app.root_path, 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            file.save(os.path.join(upload_folder, filename))

            challenge, error = ChallengeService.create_challenge(data.form,
                                                                 attachment=url_for('challenge.download_file',
                                                                                    name=filename, _external=True))

            if challenge:
                return jsonify({
                    "message": "Challenge created successfully",
                    "data": challenge.serialize()
                }), 201

            return jsonify({"error": error}), 400

        return jsonify({"error": "Invalid file type"}), 400

    @staticmethod
    @token_required
    def submit_challenge(user, token, challenge_id, data):
        if not data or 'solution' not in data:
            return jsonify({"error": "Invalid data"}), 400

        success, error = ChallengeService.submit_challenge(user, challenge_id, data['solution'])

        if success:
            return jsonify({"message": "Challenge submitted successfully"}), 200

        return jsonify({"error": error}), 400

    @staticmethod
    @token_required
    def delete_challenge(user, token, challenge_id):
        if not user.is_admin:
            return jsonify({"error": "Unauthorized"}), 403

        success, error = ChallengeService.delete_challenge(challenge_id)

        if success:
            return jsonify({"message": "Challenge deleted successfully"}), 200

        return jsonify({"error": error}), 400
