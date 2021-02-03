from rest_framework import serializers
from .models import *


class EmailSerializer (serializers.ModelSerializer):
    class Meta:
        model = EmailMessage
        fields = ('id', 'to', 'by', 'subject', 'content', 'created_at', 'created_at_full',
                  'created_at_date', 'sender_name', 'sender_email', 'to_email')


class EmailCreateSerialzer (serializers.ModelSerializer):
    class Meta:
        model = EmailMessage
        fields = ('to', 'by', 'subject', 'content')
