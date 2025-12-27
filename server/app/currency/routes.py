from flask import Blueprint, request, jsonify
import requests

currency_bp = Blueprint('currency_bp', __name__)

@currency_bp.route('/convert', methods=['POST', 'OPTIONS'])
def convert():
    if request.method == 'OPTIONS':
        # Handle CORS preflight
        return '', 200

    data = request.get_json()
    amount = data.get('amount')
    from_currency = data.get('from')
    to_currency = data.get('to')

    if not all([amount, from_currency, to_currency]):
        return jsonify({'message': 'Missing data'}), 400

    url = f"https://api.exchangerate-api.com/v4/latest/{from_currency.upper()}"
    res = requests.get(url)

    if res.status_code != 200:
        return jsonify({'message': 'Invalid base currency'}), 400

    rates = res.json().get('rates', {})
    rate = rates.get(to_currency.upper())

    if not rate:
        return jsonify({'message': 'Target currency not found'}), 400

    converted = round(float(amount) * rate, 2)
    return jsonify({'converted': converted})
