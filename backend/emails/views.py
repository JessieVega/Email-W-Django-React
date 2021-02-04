from django.http import HttpResponseRedirect
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from .models import *


class EmailListView (APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request):
        return Response([EmailSerializer(email).data for email in EmailMessage.objects.all()])

    def post(self, request):
        serializer = EmailCreateSerialzer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailDetailView (APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, email_id):
        try:
            email = EmailMessage.objects.get(id=email_id)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        return Response(EmailSerializer(email).data, status=status.HTTP_200_OK)

    def put(self, request, email_id):
        try:
            email = EmailMessage.objects.filter(id=email_id).update(
                subject=request.data['subject'],
                content=request.data['content']
            )
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        return Response("Update successful", status=status.HTTP_200_OK)

    def delete(self, request, email_id):
        try:
            email = EmailMessage.objects.get(id=email_id)
            email.delete()
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        return Response("Deletion successful", status=status.HTTP_200_OK)


class ReplyListView (APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request):
        return Response([ReplyToEmailSerializer(reply).data for reply in ReplyToEmail.objects.all()])

    def post(self, request):
        serializer = ReplyToEmailCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReplyDetailView (APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, reply_id):
        try:
            reply = ReplyToEmail.objects.get(id=reply_id)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        return Response(ReplyToEmailSerializer(reply).data, status=status.HTTP_200_OK)

    def put(self, request, reply_id):
        try:
            reply = ReplyToEmail.objects.filter(id=reply_id).update(
                title=request.data['title'],
                content=request.data['content']
            )
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        return Response("Update successful", status=status.HTTP_200_OK)

    def delete(self, request, reply_id):
        try:
            reply = ReplyToEmail.objects.get(id=reply_id)
            reply.delete()
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        return Response("Deletion successful", status=status.HTTP_200_OK)
