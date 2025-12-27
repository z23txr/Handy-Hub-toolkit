from flask import Blueprint, request, jsonify, redirect
import string, random

url_shortener = Blueprint('url_shortener', __name__)
url_db = {}  # In-memory store

def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@url_shortener.route('/shorten', methods=['POST'])
def shorten_url():
    data = request.get_json()
    original_url = data.get('originalUrl')

    if not original_url:
        return jsonify({'message': 'Original URL is required'}), 400

    code = generate_short_code()
    url_db[code] = original_url
    short_url = f"http://localhost:5000/api/url/u/{code}"
    return jsonify({'shortUrl': short_url})

@url_shortener.route('/u/<code>')
def redirect_to_original(code):
    original_url = url_db.get(code)
    if original_url:
        return redirect(original_url)
    return jsonify({'message': 'URL not found'}), 404
