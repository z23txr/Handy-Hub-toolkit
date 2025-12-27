from flask import Blueprint, request, jsonify
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

caption_bp = Blueprint('caption_bp', __name__)

# Load model & processor once globally
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

@caption_bp.route('/generate', methods=['POST'])
def generate_caption():
    file = request.files.get('image')
    if not file:
        return jsonify({'error': 'No image uploaded'}), 400

    try:
        image = Image.open(file.stream).convert('RGB')
        inputs = processor(images=image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)
        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
