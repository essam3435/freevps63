from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///account_manager.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_2fa_enabled = db.Column(db.Boolean, default=False)
    two_fa_secret = db.Column(db.String(32))

    sessions = db.relationship('Session', backref='user', lazy=True, cascade='all, delete-orphan')
    activities = db.relationship('Activity', backref='user', lazy=True, cascade='all, delete-orphan')

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    device_name = db.Column(db.String(120))
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    action = db.Column(db.String(120), nullable=False)
    details = db.Column(db.String(255))
    ip_address = db.Column(db.String(45))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()

    Activity.query.filter_by(user_id=user.id).delete()
    activity = Activity(user_id=user.id, action='account_created')
    db.session.add(activity)
    db.session.commit()

    return jsonify({'message': 'Account created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()

    if not user or not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({'error': 'Invalid username or password'}), 401

    user.last_login = datetime.utcnow()

    activity = Activity(
        user_id=user.id,
        action='login',
        ip_address=request.remote_addr
    )
    db.session.add(activity)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'created_at': user.created_at.isoformat(),
        'last_login': user.last_login.isoformat() if user.last_login else None,
        'is_2fa_enabled': user.is_2fa_enabled
    }), 200

@app.route('/api/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if 'email' in data:
        if User.query.filter_by(email=data['email']).filter(User.id != user.id).first():
            return jsonify({'error': 'Email already in use'}), 400
        user.email = data['email']

    db.session.commit()

    activity = Activity(user_id=user.id, action='profile_updated')
    db.session.add(activity)
    db.session.commit()

    return jsonify({'message': 'Profile updated successfully'}), 200

@app.route('/api/password/change', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password_hash, data.get('old_password')):
        return jsonify({'error': 'Invalid current password'}), 401

    user.password_hash = generate_password_hash(data.get('new_password'))

    activity = Activity(user_id=user.id, action='password_changed')
    db.session.add(activity)
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'}), 200

@app.route('/api/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    user_id = get_jwt_identity()
    sessions = Session.query.filter_by(user_id=user_id).all()

    return jsonify([{
        'id': s.id,
        'device_name': s.device_name,
        'ip_address': s.ip_address,
        'created_at': s.created_at.isoformat(),
        'last_activity': s.last_activity.isoformat(),
        'is_active': s.is_active
    } for s in sessions]), 200

@app.route('/api/sessions/<int:session_id>/revoke', methods=['POST'])
@jwt_required()
def revoke_session(session_id):
    user_id = get_jwt_identity()
    session = Session.query.filter_by(id=session_id, user_id=user_id).first()

    if not session:
        return jsonify({'error': 'Session not found'}), 404

    session.is_active = False

    activity = Activity(user_id=user_id, action='session_revoked', details=f'Session {session_id}')
    db.session.add(activity)
    db.session.commit()

    return jsonify({'message': 'Session revoked successfully'}), 200

@app.route('/api/activity', methods=['GET'])
@jwt_required()
def get_activity():
    user_id = get_jwt_identity()
    activities = Activity.query.filter_by(user_id=user_id).order_by(Activity.created_at.desc()).limit(50).all()

    return jsonify([{
        'id': a.id,
        'action': a.action,
        'details': a.details,
        'ip_address': a.ip_address,
        'created_at': a.created_at.isoformat()
    } for a in activities]), 200

@app.route('/api/2fa/enable', methods=['POST'])
@jwt_required()
def enable_2fa():
    import pyotp
    import qrcode
    import io
    import base64

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.is_2fa_enabled:
        return jsonify({'error': '2FA already enabled'}), 400

    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)

    qr = qrcode.QRCode()
    qr.add_data(totp.provisioning_uri(name=user.email, issuer_name='Account Manager'))
    qr.make()

    img = qr.make_image()
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    qr_code = base64.b64encode(buf.getvalue()).decode()

    return jsonify({
        'secret': secret,
        'qr_code': f'data:image/png;base64,{qr_code}'
    }), 200

@app.route('/api/2fa/confirm', methods=['POST'])
@jwt_required()
def confirm_2fa():
    import pyotp

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    secret = data.get('secret')
    code = data.get('code')

    totp = pyotp.TOTP(secret)
    if not totp.verify(code):
        return jsonify({'error': 'Invalid code'}), 400

    user.two_fa_secret = secret
    user.is_2fa_enabled = True

    activity = Activity(user_id=user.id, action='2fa_enabled')
    db.session.add(activity)
    db.session.commit()

    return jsonify({'message': '2FA enabled successfully'}), 200

@app.route('/api/2fa/disable', methods=['POST'])
@jwt_required()
def disable_2fa():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if not user.is_2fa_enabled:
        return jsonify({'error': '2FA not enabled'}), 400

    user.is_2fa_enabled = False
    user.two_fa_secret = None

    activity = Activity(user_id=user.id, action='2fa_disabled')
    db.session.add(activity)
    db.session.commit()

    return jsonify({'message': '2FA disabled successfully'}), 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
