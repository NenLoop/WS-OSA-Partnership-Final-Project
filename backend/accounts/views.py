from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework import generics
from .serializers import CustomUserSerializer
from .models import CustomUser

from rest_framework.decorators import action
from rest_framework.response import Response

class CustomUserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=["post"])
    def promote(self, request, pk=None):
        user = self.get_object()
        user.is_staff = True
        user.save()
        return Response({"status": "user promoted"})

        #we need to have a validation to know if the user is a staff or not - staff validation
        #if it is a staff - we can only demote them
        #if not a staff - we can only promote them

    @action(detail=True, methods=["post"])
    def demote(self, request, pk=None):
        user = self.get_object()
        user.is_staff = False
        user.save()
        return Response({"status": "user promoted"})

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]
