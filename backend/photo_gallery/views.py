from rest_framework import viewsets, permissions
from .models import Photo 
from .serializers import PhotoSerializer 
from rest_framework.parsers import MultiPartParser, FormParser

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by('-uploaded_at')
    serializer_class = PhotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

