from flask import Blueprint, request, send_file
import qrcode
from io import BytesIO

qr_bp = Blueprint('qr_bp', __name__)

@qr_bp.route('/generate', methods=['POST'])
def generate_qr():
    data = request.get_json()
    text = data.get('text')

    if not text:
        return {"message": "Text is required"}, 400

    img = qrcode.make(text)
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')
