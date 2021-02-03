from django.urls import path
from .views import *

urlpatterns = [
    path('current-user', current_user),
    path('users/', UserList.as_view())
]
