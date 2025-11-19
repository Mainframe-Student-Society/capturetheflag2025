from datetime import date
from app.models.challenge import Challenge
from app import db


class ChallengeService:
    @staticmethod
    def get_challenges(user):
        challenges = Challenge.query.filter(Challenge.level <= user.level).all()

        completed = []
        available = []
        for challenge in challenges:
            if challenge.level < user.level:
                completed.append(challenge)
            else:
                available.append(challenge)

        return available, completed

    @staticmethod
    def get_challenge(user, challenge_id):
        challenge = Challenge.query.filter(Challenge.id == challenge_id, Challenge.level <= user.level).first()

        return challenge

    @staticmethod
    def create_challenge(data):
        try:
            new_challenge = Challenge()
            new_challenge.title = data['title']
            new_challenge.description = data['description']
            new_challenge.attachments = data.get('attachments', 'text.txt')
            new_challenge.level = data['level']
            new_challenge.points = data['points']
            new_challenge.solution = data['solution']
            db.session.add(new_challenge)
            db.session.commit()

            return new_challenge, None
        except Exception as e:
            db.session.rollback()
            return None, str(e)

    @staticmethod
    def submit_challenge(user, challenge_id, solution):
        try:
            challenge = Challenge.query.filter(Challenge.id == challenge_id, Challenge.level == user.level).first()

            if not challenge:
                return False, "Challenge not found"

            if challenge.solution != solution:
                return False, "Incorrect solution"

            user.level += 1
            target = date(2025, 11, 25)
            submission_date = date.today()
            days = (target - submission_date).days
            if days < 0:
                days = 0
            user.score += challenge.points * days
            db.session.commit()
            db.session.commit()

            return True, None
        except Exception as e:
            db.session.rollback()
            return False, str(e)
