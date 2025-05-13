from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model
from .ai_services import FreeImageAnalyzer

User = get_user_model()

class Photo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='photos')
    
    def __str__(self):
        return self.title

    def analyze_with_ai(self):
        analyzer = FreeImageAnalyzer()
        results = analyzer.analyze_image(self.image.path)
        self.ai_data = results
        self.save()
        
        # Generate suggestions
        if results['labels']:
            print(results)
            # if not self.title:
                # self.title = results['labels'][0].replace('_', ' ').title()
            # if not self.tags.all():
                # self.tags.add(*[label.replace('_', ' ') for label in results['labels'][:3]])
        # self.save()
        return results

