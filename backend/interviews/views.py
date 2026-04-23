from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import InterviewMessage, InterviewSession
from .serializers import (
    InterviewSessionSerializer,
    SendMessageSerializer,
    StartInterviewSerializer,
)
from .services import evaluate_answer_fake, finalize_session, generate_first_question


class StartInterviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = StartInterviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = InterviewSession.objects.create(
            user=request.user,
            role=serializer.validated_data["role"],
            interview_type=serializer.validated_data["interview_type"],
            level=serializer.validated_data["level"],
            language=serializer.validated_data["language"],
            max_questions=serializer.validated_data["max_questions"],
        )

        first_question = generate_first_question(session)
        InterviewMessage.objects.create(
            session=session,
            sender="ai",
            content=first_question,
        )

        return Response(InterviewSessionSerializer(session).data, status=status.HTTP_201_CREATED)


class InterviewSessionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = InterviewSession.objects.filter(user=request.user)
        serializer = InterviewSessionSerializer(sessions, many=True)
        return Response(serializer.data)


class InterviewSessionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
        serializer = InterviewSessionSerializer(session)
        return Response(serializer.data)


class InterviewMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(InterviewSession, id=session_id, user=request.user)

        if session.is_finished:
            return Response(
                {"detail": "This interview session is already finished."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answer = serializer.validated_data["answer"].strip()

        user_message = InterviewMessage.objects.create(
            session=session,
            sender="user",
            content=answer,
        )

        evaluation = evaluate_answer_fake(session, answer)

        user_message.score = evaluation["score"]
        user_message.feedback = evaluation["feedback"]
        user_message.improved_answer = evaluation["improved_answer"]
        user_message.save(update_fields=["score", "feedback", "improved_answer"])

        session.question_count += 1
        session.save(update_fields=["question_count", "updated_at"])

        if evaluation["finished"]:
            finalize_session(session)
        else:
            InterviewMessage.objects.create(
                session=session,
                sender="ai",
                content=evaluation["next_question"],
            )

        session.refresh_from_db()
        return Response(InterviewSessionSerializer(session).data, status=status.HTTP_200_OK)