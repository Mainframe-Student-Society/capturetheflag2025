from app.models.faq import FAQ
from app import db


class FAQService:
    @staticmethod
    def get_all_faqs():
        return FAQ.query.order_by(FAQ.created_at.desc()).all()

    @staticmethod
    def create_faq(question, answer):
        faq = FAQ(question=question, answer=answer)
        db.session.add(faq)
        db.session.commit()
        return faq

    @staticmethod
    def delete_faq(faq_id):
        faq = FAQ.query.get(faq_id)
        if faq:
            db.session.delete(faq)
            db.session.commit()
            return True
        return False
