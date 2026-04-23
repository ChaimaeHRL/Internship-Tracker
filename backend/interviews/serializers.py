from rest_framework import serializers
from .models import InterviewSession, InterviewMessage


class InterviewMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewMessage
        fields = [
            "id",
            "sender",
            "content",
            "score",
            "feedback",
            "improved_answer",
            "created_at",
        ]


class InterviewSessionSerializer(serializers.ModelSerializer):
    messages = InterviewMessageSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "role",
            "interview_type",
            "level",
            "language",
            "is_finished",
            "final_score",
            "summary",
            "question_count",
            "max_questions",
            "created_at",
            "updated_at",
            "messages",
        ]


class StartInterviewSerializer(serializers.Serializer):
    role = serializers.CharField(max_length=200)
    interview_type = serializers.ChoiceField(choices=["hr", "technical", "behavioral", "english"])
    level = serializers.ChoiceField(choices=["intern", "junior", "mid"])
    language = serializers.ChoiceField(choices=["fr", "en"])
    max_questions = serializers.IntegerField(min_value=3, max_value=10, default=5)


class SendMessageSerializer(serializers.Serializer):
    answer = serializers.CharField()