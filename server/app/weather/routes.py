from flask import Blueprint, request, jsonify
import requests

weather_bp = Blueprint('weather_bp', __name__)

@weather_bp.route('', methods=['POST'])
def get_weather():
    data = request.get_json()
    city = data.get('city')

    if not city:
        return jsonify({'message': 'City is required'}), 400

    api_key = '8ea1f8bae94d415cbbf74652251207'
    url = f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=10&aqi=no&alerts=no"

    try:
        res = requests.get(url)
        if res.status_code != 200:
            return jsonify({'message': 'Failed to fetch weather', 'details': res.json()}), 400

        weather_data = res.json()
        current = weather_data['current']
        forecast = weather_data['forecast']['forecastday']

        return jsonify({
            'current': {
                'city': weather_data['location']['name'],
                'country': weather_data['location']['country'],
                'temperature': current['temp_c'],
                'description': current['condition']['text'],
                'icon': current['condition']['icon']
            },
            'forecast': [
                {
                    'date': day['date'],
                    'avg_temp': day['day']['avgtemp_c'],
                    'condition': day['day']['condition']['text'],
                    'icon': day['day']['condition']['icon']
                } for day in forecast
            ]
        })

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
