# Register your models here.
from django.contrib import admin
from .models import Photo 

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'uploaded_at')
    list_filter = ('uploaded_at', 'user')
    search_fields = ('title', 'description')
