from django.urls import path
from .views import *

urlpatterns = [
    path('', EmailListView.as_view()),
    path('<email_id>', EmailDetailView.as_view())
]
