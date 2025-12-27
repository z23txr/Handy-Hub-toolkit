from . import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)  # ✅ required
    password = db.Column(db.String(200), nullable=False)

    def check_password(self, password_input):
        return bcrypt.check_password_hash(self.password, password_input)
