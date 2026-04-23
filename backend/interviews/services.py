import json
import random
from django.conf import settings
from .models import InterviewMessage, InterviewSession

FAKE_QUESTIONS = {
    ("hr", "fr"): [
        "Présentez-vous en une minute.",
        "Pourquoi voulez-vous ce stage ?",
        "Pourquoi cette entreprise ?",
        "Quel est votre principal point fort ?",
        "Parlez-moi d’un défi que vous avez surmonté.",
        "Comment gérez-vous le stress ?",
    ],
    ("technical", "fr"): [
        "Expliquez la différence entre une API REST et une API classique.",
        "Qu’est-ce qu’un composant React ?",
        "À quoi sert Django REST Framework ?",
        "Expliquez la différence entre PUT et PATCH.",
        "Comment gérez-vous l’état dans une application React ?",
        "Que signifie authentification JWT ?",
    ],
    ("behavioral", "fr"): [
        "Parlez-moi d’un projet d’équipe dont vous êtes fière.",
        "Comment réagissez-vous face à une critique ?",
        "Racontez une situation où vous avez dû apprendre vite.",
        "Comment vous organisez-vous quand vous avez plusieurs tâches ?",
        "Donnez un exemple de problème que vous avez résolu.",
    ],
    ("english", "en"): [
        "Tell me about yourself.",
        "Why do you want this internship?",
        "What are your strengths?",
        "Describe a challenge you faced and how you handled it.",
        "Why should we hire you?",
    ],
}


def _pick_first_question(interview_type: str, language: str) -> str:
    key = (interview_type, language)
    questions = FAKE_QUESTIONS.get(key) or FAKE_QUESTIONS.get((interview_type, "fr")) or [
        "Présentez-vous."
    ]
    return questions[0]


def _pick_next_question(session: InterviewSession) -> str:
    key = (session.interview_type, session.language)
    questions = FAKE_QUESTIONS.get(key) or FAKE_QUESTIONS.get((session.interview_type, "fr")) or [
        "Présentez-vous."
    ]
    index = min(session.question_count, len(questions) - 1)
    return questions[index]


def generate_first_question(session: InterviewSession) -> str:
    return _pick_first_question(session.interview_type, session.language)


def evaluate_answer_fake(session: InterviewSession, answer: str) -> dict:
    words = len(answer.split())
    base_score = 4
    if words > 15:
        base_score += 2
    if words > 35:
        base_score += 1
    if any(x in answer.lower() for x in ["projet", "project", "expérience", "experience", "stage"]):
        base_score += 1
    if any(x in answer.lower() for x in ["résultat", "result", "impact", "amélior", "improv"]):
        base_score += 1

    score = max(1, min(10, base_score))

    feedback = (
        "Réponse correcte, mais elle gagnerait à être plus structurée avec un exemple concret, "
        "un résultat mesurable et une conclusion plus claire."
    )
    if session.language == "en":
        feedback = (
            "Good answer overall, but it would be stronger with a clearer structure, "
            "a concrete example, and a measurable result."
        )

    improved_answer = (
        "J’ai développé cette compétence à travers mes projets académiques et personnels. "
        "Par exemple, sur un projet récent, j’ai travaillé sur la conception, l’implémentation "
        "et les tests, ce qui m’a permis d’améliorer ma rigueur, ma communication et ma capacité "
        "à livrer un résultat concret."
    )
    if session.language == "en":
        improved_answer = (
            "I developed this skill through academic and personal projects. For example, "
            "in a recent project, I contributed to design, implementation, and testing, "
            "which helped me improve my rigor, communication, and ability to deliver concrete results."
        )

    next_question = None
    finished = session.question_count + 1 >= session.max_questions

    if not finished:
        next_question = _pick_next_question(session)

    return {
        "score": score,
        "feedback": feedback,
        "improved_answer": improved_answer,
        "next_question": next_question,
        "finished": finished,
    }


def finalize_session(session: InterviewSession):
    scored_messages = session.messages.filter(sender="user").exclude(score__isnull=True)
    if scored_messages.exists():
        avg = round(sum(m.score for m in scored_messages if m.score is not None) / scored_messages.count())
    else:
        avg = None

    if session.language == "en":
        summary = (
            "Interview finished. Keep improving structure, precision, and concrete examples. "
            "Use the STAR method more often and quantify your impact when possible."
        )
    else:
        summary = (
            "Entretien terminé. Continue à améliorer la structure de tes réponses, la précision "
            "et l’utilisation d’exemples concrets. La méthode STAR peut beaucoup t’aider."
        )

    session.is_finished = True
    session.final_score = avg
    session.summary = summary
    session.save(update_fields=["is_finished", "final_score", "summary", "updated_at"])