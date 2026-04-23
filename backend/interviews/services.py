import random
from .models import InterviewSession

FAKE_QUESTIONS = {
    ("hr", "fr"): [
        "Présentez-vous en une minute.",
        "Pourquoi voulez-vous ce stage ?",
        "Pourquoi cette entreprise ?",
        "Quel est votre principal point fort ?",
        "Quel est votre principal point faible ?",
        "Parlez-moi d’un défi que vous avez surmonté.",
        "Comment gérez-vous le stress ?",
        "Comment réagissez-vous face à une critique ?",
        "Quelle est votre plus grande réussite ?",
        "Parlez-moi d’un échec et de ce que vous avez appris.",
        "Comment vous organisez-vous lorsque vous avez plusieurs tâches en parallèle ?",
        "Pourquoi devrions-nous vous choisir ?",
        "Comment travaillez-vous en équipe ?",
        "Donnez un exemple de conflit que vous avez dû gérer.",
        "Qu’attendez-vous de ce stage ?",
        "Où vous voyez-vous dans 3 ans ?",
        "Qu’est-ce qui vous motive au quotidien ?",
        "Comment apprenez-vous une nouvelle compétence ?",
        "Parlez-moi d’une situation où vous avez pris une initiative.",
        "Comment réagiriez-vous si vous aviez une deadline très courte ?",
    ],
    ("technical", "fr"): [
        "Expliquez ce qu’est une API REST.",
        "Quelle est la différence entre GET, POST, PUT et PATCH ?",
        "Qu’est-ce qu’un composant React ?",
        "Quelle est la différence entre state et props dans React ?",
        "À quoi sert useEffect ?",
        "Comment gérez-vous l’état dans une application React ?",
        "Qu’est-ce que Django REST Framework apporte à Django ?",
        "Qu’est-ce que JWT et pourquoi l’utiliser ?",
        "Comment sécuriser une API ?",
        "Quelle est la différence entre authentification et autorisation ?",
        "À quoi sert une base de données relationnelle ?",
        "Qu’est-ce qu’une clé étrangère ?",
        "Comment modéliser une relation utilisateur-candidatures ?",
        "Comment valider les données côté backend ?",
        "Pourquoi utiliser des serializers dans DRF ?",
        "Quelle est la différence entre frontend et backend ?",
        "Comment fonctionne CORS ?",
        "Que signifie 401 Unauthorized ?",
        "Que signifie 403 Forbidden ?",
        "Comment débugger une erreur 500 côté backend ?",
        "Comment organiser un projet React proprement ?",
        "Comment structurer un projet Django proprement ?",
        "Qu’est-ce qu’une migration Django ?",
        "Pourquoi utiliser Git dans un projet comme celui-ci ?",
        "Expliquez le cycle complet d’une requête depuis le frontend vers le backend.",
        "Comment gérer l’upload d’un fichier dans Django ?",
        "Comment afficher une image uploadée côté frontend ?",
        "Comment tester une API REST ?",
        "Comment feriez-vous évoluer cette application à plus grande échelle ?",
        "Comment améliorer les performances d’une application web ?",
    ],
    ("behavioral", "fr"): [
        "Parlez-moi d’un projet d’équipe dont vous êtes fière.",
        "Décrivez une situation où vous avez dû apprendre rapidement.",
        "Racontez une situation où vous avez dû sortir de votre zone de confort.",
        "Comment réagissez-vous lorsque vous ne connaissez pas la solution ?",
        "Donnez un exemple d’objectif que vous avez atteint avec discipline.",
        "Parlez-moi d’un moment où vous avez aidé un coéquipier.",
        "Décrivez une situation où vous avez fait preuve de leadership.",
        "Comment vous comportez-vous sous pression ?",
        "Donnez un exemple d’erreur que vous avez corrigée.",
        "Décrivez une situation où vous avez dû vous adapter rapidement.",
        "Comment priorisez-vous votre travail ?",
        "Parlez d’un moment où vous avez reçu un feedback difficile.",
        "Décrivez un projet dont vous êtes particulièrement fière.",
        "Comment réagissez-vous face à l’ambiguïté ?",
        "Donnez un exemple où vous avez dû convaincre quelqu’un.",
        "Décrivez une situation où vous avez fait face à une contrainte de temps.",
        "Comment gérez-vous les imprévus ?",
        "Racontez une situation où vous avez pris une décision importante.",
        "Comment faites-vous quand vous êtes bloquée sur un problème ?",
        "Décrivez une situation où vous avez amélioré un processus.",
    ],
    ("english", "en"): [
        "Tell me about yourself.",
        "Why do you want this internship?",
        "Why do you want to work at this company?",
        "What are your strengths?",
        "What is one of your weaknesses?",
        "Describe a challenge you faced and how you handled it.",
        "Tell me about a project you are proud of.",
        "How do you handle pressure?",
        "How do you prioritize your work?",
        "Describe a time you worked in a team.",
        "Tell me about a time you received critical feedback.",
        "How do you learn a new skill quickly?",
        "Why should we hire you?",
        "What motivates you?",
        "Where do you see yourself in three years?",
        "Describe a situation where you showed initiative.",
        "Tell me about a time you made a mistake.",
        "How do you manage deadlines?",
        "Describe a time you solved a problem creatively.",
        "What do you expect from this internship?",
    ],
}


def _get_question_pool(session: InterviewSession):
    key = (session.interview_type, session.language)
    if key in FAKE_QUESTIONS:
        return FAKE_QUESTIONS[key]

    fallback_key = (session.interview_type, "fr")
    if fallback_key in FAKE_QUESTIONS:
        return FAKE_QUESTIONS[fallback_key]

    return ["Présentez-vous."]


def _get_already_asked_ai_questions(session: InterviewSession):
    return list(
        session.messages.filter(sender="ai").values_list("content", flat=True)
    )


def _pick_random_new_question(session: InterviewSession) -> str:
    questions = _get_question_pool(session)
    asked = set(_get_already_asked_ai_questions(session))

    available = [q for q in questions if q not in asked]

    if not available:
        # si toutes les questions ont déjà été utilisées,
        # on re-randomise dans toute la liste
        available = questions

    return random.choice(available)


def generate_first_question(session: InterviewSession) -> str:
    return _pick_random_new_question(session)


def evaluate_answer_fake(session: InterviewSession, answer: str) -> dict:
    words = len(answer.split())
    answer_lower = answer.lower()

    score = 3

    if words >= 10:
        score += 1
    if words >= 20:
        score += 1
    if words >= 35:
        score += 1

    keywords = [
        "projet", "project",
        "expérience", "experience",
        "stage", "internship",
        "résultat", "result",
        "impact", "amélioration", "improvement",
        "équipe", "team",
        "objectif", "goal",
        "problème", "problem",
        "solution", "initiative",
    ]

    keyword_hits = sum(1 for k in keywords if k in answer_lower)
    if keyword_hits >= 2:
        score += 1
    if keyword_hits >= 4:
        score += 1

    if any(x in answer_lower for x in ["j'ai", "i have", "i worked", "j’ai travaillé", "j'ai travaillé"]):
        score += 1

    score = max(1, min(10, score))

    if session.language == "en":
        if score <= 4:
            feedback = (
                "Your answer is understandable, but it is still too short and lacks structure. "
                "Try using a clear example and explain your role, your actions, and the result."
            )
        elif score <= 7:
            feedback = (
                "Good foundation. Your answer is relevant, but it would be stronger with more precision, "
                "a concrete example, and a measurable impact."
            )
        else:
            feedback = (
                "Strong answer. It is clear and relevant. To make it even better, add more measurable outcomes "
                "and keep a very structured flow."
            )

        improved_answer = (
            "In one of my recent projects, I worked on both the technical implementation and the organization of the work. "
            "I had to understand the requirements, build the solution, test it, and adjust it when needed. "
            "This experience helped me improve my problem-solving skills, communication, and ability to deliver useful results."
        )
    else:
        if score <= 4:
            feedback = (
                "Votre réponse est compréhensible, mais elle reste trop courte et pas assez structurée. "
                "Essayez de donner un exemple concret en expliquant le contexte, vos actions et le résultat."
            )
        elif score <= 7:
            feedback = (
                "Bonne base. Votre réponse est pertinente, mais elle serait plus forte avec davantage de précision, "
                "un exemple concret et un impact mesurable."
            )
        else:
            feedback = (
                "Très bonne réponse. Elle est claire et pertinente. Pour aller encore plus loin, "
                "ajoutez des résultats mesurables et gardez une structure très nette."
            )

        improved_answer = (
            "Lors d’un projet récent, j’ai participé à la conception, à l’implémentation et à l’amélioration de la solution. "
            "J’ai dû comprendre le besoin, proposer une approche adaptée, puis tester et ajuster le résultat. "
            "Cette expérience m’a permis de développer ma rigueur, ma capacité d’analyse et mon sens de la collaboration."
        )

    finished = session.question_count + 1 >= session.max_questions
    next_question = None if finished else _pick_random_new_question(session)

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
        average = sum(m.score for m in scored_messages if m.score is not None) / scored_messages.count()
        final_score = round(average)
    else:
        final_score = None

    if session.language == "en":
        summary = (
            "Interview completed. Continue improving the structure of your answers, "
            "use concrete examples, and highlight measurable results whenever possible."
        )
    else:
        summary = (
            "Entretien terminé. Continuez à améliorer la structure de vos réponses, "
            "à utiliser des exemples concrets et à mettre en avant des résultats mesurables."
        )

    session.is_finished = True
    session.final_score = final_score
    session.summary = summary
    session.save(update_fields=["is_finished", "final_score", "summary", "updated_at"])