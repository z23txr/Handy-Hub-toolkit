from flask_mail import Message
from app import mail, bcrypt

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

def send_email(to, subject, body):
    msg = Message(subject, recipients=[to])
    msg.body = body
    mail.send(msg)
