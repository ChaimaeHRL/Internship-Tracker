from django.urls import path
from .views import (
    StartInterviewView,
    InterviewSessionListView,
    InterviewSessionDetailView,
    InterviewMessageView,
)

urlpatterns = [
    path("start/", StartInterviewView.as_view(), name="interview-start"),
    path("", InterviewSessionListView.as_view(), name="interview-list"),
    path("<int:session_id>/", InterviewSessionDetailView.as_view(), name="interview-detail"),
    path("<int:session_id>/message/", InterviewMessageView.as_view(), name="interview-message"),
]