from django.urls import path
from .views import *

urlpatterns = [
    path('', EmailListView.as_view()),
    path('<email_id>', EmailDetailView.as_view()),
    path('replies/', ReplyListView.as_view()),
    path('replies/<reply_id>', ReplyDetailView.as_view())
]
