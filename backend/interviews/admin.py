from django.contrib import admin
from .models import InterviewSession, InterviewMessage


class InterviewMessageInline(admin.TabularInline):
    model = InterviewMessage
    extra = 0
    readonly_fields = ("sender", "content", "score", "feedback", "improved_answer", "created_at")


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "role",
        "interview_type",
        "language",
        "level",
        "is_finished",
        "final_score",
        "created_at",
    )
    list_filter = ("interview_type", "language", "level", "is_finished")
    search_fields = ("user__username", "role")
    inlines = [InterviewMessageInline]