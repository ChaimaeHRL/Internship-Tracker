from django.db import models
from django.contrib.auth.models import User


class InterviewSession(models.Model):
    INTERVIEW_TYPES = [
        ("hr", "HR"),
        ("technical", "Technical"),
        ("behavioral", "Behavioral"),
        ("english", "English"),
    ]

    LEVELS = [
        ("intern", "Intern"),
        ("junior", "Junior"),
        ("mid", "Mid"),
    ]

    LANGUAGES = [
        ("fr", "French"),
        ("en", "English"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interview_sessions")
    role = models.CharField(max_length=200)
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPES)
    level = models.CharField(max_length=20, choices=LEVELS, default="intern")
    language = models.CharField(max_length=10, choices=LANGUAGES, default="fr")
    is_finished = models.BooleanField(default=False)
    final_score = models.PositiveSmallIntegerField(null=True, blank=True)
    summary = models.TextField(blank=True, null=True)
    question_count = models.PositiveSmallIntegerField(default=0)
    max_questions = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.role} ({self.interview_type})"


class InterviewMessage(models.Model):
    SENDERS = [
        ("ai", "AI"),
        ("user", "User"),
    ]

    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=10, choices=SENDERS)
    content = models.TextField()
    score = models.PositiveSmallIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    improved_answer = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.session_id} - {self.sender}"