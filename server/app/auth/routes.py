from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token
from app.models import db, User
from app.auth.utils import hash_password, send_email
from datetime import timedelta
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
import os

auth_bp = Blueprint('auth', __name__)
s = URLSafeTimedSerializer(os.getenv('FLASK_SECRET_KEY', 'supersecretkey'))

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 409

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hash_password(data['password'])
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Signup successful'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        return jsonify({'token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/send-reset-link', methods=['POST'])
def send_reset_link():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'message': 'Email not found'}), 404

    try:
        token = s.dumps(user.email, salt='reset-password')
        link = url_for('auth.reset_password', token=token, _external=True)
        send_email(user.email, 'Password Reset Request', f'Click the link to reset your password: {link}')
        return jsonify({'message': 'Password reset link sent to your email'}), 200
    except Exception as e:
        print(f"Email sending error: {e}")
        return jsonify({'message': 'Failed to send email'}), 500

@auth_bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        email = s.loads(token, salt='reset-password', max_age=3600)
    except (SignatureExpired, BadSignature):
        return jsonify({'message': 'Invalid or expired token'}), 400

    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        user.password = hash_password(data['password'])
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200

    return jsonify({'message': 'Valid token, send new password via POST'}), 200
