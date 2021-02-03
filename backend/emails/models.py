from django.db import models
from users.models import *

import datetime


class EmailMessage (models.Model):
    by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='by')
    to = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='to')
    subject = models.CharField(max_length=150)
    content = models.TextField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def created_at_date(self):
        return self.created_at.strftime('%m/%d/%y')

    @property
    def created_at_full(self):
        return self.created_at.strftime('%B %-d, %Y at %I:%M %p')

    @property
    def sender_name(self):
        sender = CustomUser.objects.get(id=self.by.id)
        return sender.first_name + ' ' + sender.last_name

    @property
    def sender_email(self):
        return CustomUser.objects.get(id=self.by.id).email

    @property
    def to_email(self):
        return CustomUser.objects.get(id=self.to.id).email
