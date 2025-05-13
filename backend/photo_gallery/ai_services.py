from transformers import ViTFeatureExtractor, ViTForImageClassification
from PIL import Image
import torch

class FreeImageAnalyzer:
    def __init__(self):
        self.feature_extractor = ViTFeatureExtractor.from_pretrained('google/vit-base-patch16-224')
        self.model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')

    def analyze_image(self, image_path):
        try:
            image = Image.open(image_path)
            if image.mode != 'RGB':
                image = image.convert('RGB')
                
            inputs = self.feature_extractor(images=image, return_tensors="pt")
            outputs = self.model(**inputs)
            logits = outputs.logits
            predicted_class_idx = logits.argmax(-1).item()
            
            # Get top 5 predictions
            probs = torch.nn.functional.softmax(logits, dim=-1)
            top_probs, top_classes = torch.topk(probs, 5)
            
            return {
                'labels': [
                    self.model.config.id2label[int(i)] 
                    for i in top_classes[0]
                ],
                'confidences': [
                    round(float(prob) * 100, 2) 
                    for prob in top_probs[0]
                ]
            }
        except Exception as e:
            print(f"AI Analysis Error: {str(e)}")
            return {'labels': [], 'confidences': []}