from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail

# Initialize extensions globally
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # Register blueprints
    from app.auth.routes import auth_bp
    from app.url_shortener.routes import url_shortener
    from app.qr.routes import qr_bp
    from app.caption.routes import caption_bp
    from app.weather.routes import weather_bp
    from app.voice.routes import voice_bp
    from app.currency.routes import currency_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(url_shortener, url_prefix='/api/url')
    app.register_blueprint(qr_bp, url_prefix='/api/qr')
    app.register_blueprint(caption_bp, url_prefix='/api/caption')
    app.register_blueprint(weather_bp, url_prefix='/api/weather')
    app.register_blueprint(voice_bp, url_prefix='/api')
    app.register_blueprint(currency_bp, url_prefix='/api')

    with app.app_context():
        db.create_all()

    return app
