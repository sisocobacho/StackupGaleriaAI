from rest_framework import serializers
from .models import Photo 
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class PhotoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    
    class Meta:
        model = Photo
        fields = ['id', 'title', 'description', 'image', 'uploaded_at', 'user', ]
        read_only_fields = ['uploaded_at', 'user']

