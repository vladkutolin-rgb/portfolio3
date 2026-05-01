from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from functools import wraps
import sqlite3
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'tvoy-sekretnyy-klyuch-12345'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def init_db():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS gallery
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  photo TEXT NOT NULL,
                  description TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS certificates
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  photo TEXT NOT NULL,
                  title TEXT NOT NULL,
                  description TEXT,
                  organization TEXT,
                  year TEXT,
                  course TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS works
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  title TEXT NOT NULL,
                  description TEXT,
                  icon TEXT DEFAULT 'fa-code',
                  file_path TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS settings
                 (key TEXT PRIMARY KEY,
                  value TEXT)''')
    
    # Админ по умолчанию
    c.execute('SELECT * FROM users WHERE username = ?', ('admin',))
    if not c.fetchone():
        c.execute('INSERT INTO users (username, password) VALUES (?, ?)', ('ID1Vlad', '43Vl_ad33'))
    
    conn.commit()
    conn.close()

init_db()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def get_setting(key):
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT value FROM settings WHERE key = ?', (key,))
    result = c.fetchone()
    conn.close()
    return result[0] if result else None

# ==================== СТРАНИЦЫ ====================

@app.route('/')
def index():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    c.execute('SELECT * FROM gallery ORDER BY created_at DESC')
    gallery_items = c.fetchall()
    
    c.execute('SELECT * FROM certificates ORDER BY created_at DESC')
    certificates = c.fetchall()
    
    c.execute('SELECT * FROM works ORDER BY created_at DESC')
    works = c.fetchall()
    
    avatar = get_setting('avatar') or 'static/uploads/default_avatar.jpg'
    
    conn.close()
    
    return render_template('index.html', gallery=gallery_items, certificates=certificates, works=works, avatar=avatar)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = sqlite3.connect('portfolio.db')
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
        user = c.fetchone()
        conn.close()
        
        if user:
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for('admin'))
        else:
            error = 'Неверный логин или пароль'
    
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/admin')
@login_required
def admin():
    return render_template('admin.html')

# ==================== API ====================

@app.route('/api/gallery', methods=['GET'])
def api_get_gallery():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT * FROM gallery ORDER BY created_at DESC')
    items = [{'id': row[0], 'photo': row[1], 'description': row[2]} for row in c.fetchall()]
    conn.close()
    return jsonify(items)

@app.route('/api/gallery', methods=['POST'])
def api_add_gallery():
    if 'logged_in' not in session:
        return jsonify({'error': 'Требуется авторизация'}), 401
    
    if 'photo' not in request.files:
        return jsonify({'error': 'Нет фото'}), 400
    
    file = request.files['photo']
    description = request.form.get('description', '')
    
    if file.filename == '':
        return jsonify({'error': 'Файл не выбран'}), 400
    
    filename = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('INSERT INTO gallery (photo, description) VALUES (?, ?)',
              (f'static/uploads/{filename}', description))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/gallery/<int:id>', methods=['DELETE'])
def api_delete_gallery(id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Требуется авторизация'}), 401
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT photo FROM gallery WHERE id = ?', (id,))
    item = c.fetchone()
    if item and os.path.exists(item[0]):
        os.remove(item[0])
    c.execute('DELETE FROM gallery WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/certificates', methods=['GET'])
def api_get_certificates():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT * FROM certificates ORDER BY created_at DESC')
    items = [{'id': row[0], 'photo': row[1], 'title': row[2], 'description': row[3],
              'organization': row[4], 'year': row[5], 'course': row[6]} for row in c.fetchall()]
    conn.close()
    return jsonify(items)

@app.route('/api/certificates', methods=['POST'])
def api_add_certificate():
    if 'logged_in' not in session:
        return jsonify({'error': 'Требуется авторизация'}), 401
    
    if 'photo' not in request.files:
        return jsonify({'error': 'Нет фото'}), 400
    
    file = request.files['photo']
    if file.filename == '':
        return jsonify({'error': 'Файл не выбран'}), 400
    
    filename = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('INSERT INTO certificates (photo, title, description, organization, year, course) VALUES (?, ?, ?, ?, ?, ?)',
              (f'static/uploads/{filename}',
               request.form.get('title', ''),
               request.form.get('description', ''),
               request.form.get('organization', ''),
               request.form.get('year', ''),
               request.form.get('course', '1')))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/certificates/<int:id>', methods=['DELETE'])
def api_delete_certificate(id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Требуется авторизация'}), 401
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT photo FROM certificates WHERE id = ?', (id,))
    item = c.fetchone()
    if item and os.path.exists(item[0]):
        os.remove(item[0])
    c.execute('DELETE FROM certificates WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/works', methods=['GET'])
def api_get_works():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT * FROM works ORDER BY created_at DESC')
    items = [{'id': row[0], 'title': row[1], 'description': row[2], 'icon': row[3], 'file_path': row[4]} for row in c.fetchall()]
    conn.close()
    return jsonify(items)

@app.route('/api/works', methods=['POST'])
def api_add_work():
    if 'logged_in' not in session:
        return jsonify({'error': 'Требуется авторизация'}), 401
    
    title = request.form.get('title', '')
    description = request.form.get('description', '')
    icon = request.form.get('icon', 'fa-code')
    file_path = None
    
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        filename = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        file_path = f'static/uploads/{filename}'
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('INSERT INTO works (title, description, icon, file_path) VALUES (?, ?, ?, ?)',
              (title, description, icon, file_path))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/works/<int:id>', methods=['DELETE'])
def api_delete_work(id):
    if 'logged_in' not in session:
        return jsonify({'error': 'Требуется авторизация'}), 401
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT file_path FROM works WHERE id = ?', (id,))
    item = c.fetchone()
    if item and item[0] and os.path.exists(item[0]):
        os.remove(item[0])
    c.execute('DELETE FROM works WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/avatar', methods=['POST'])
def api_update_avatar():
    if 'logged_in' not in session:
        return jsonify({'error': 'Требуется авторизация'}), 401
    
    if 'avatar' not in request.files:
        return jsonify({'error': 'Нет файла'}), 400
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({'error': 'Файл не выбран'}), 400
    
    # Удаляем старый аватар
    old_avatar = get_setting('avatar')
    if old_avatar and os.path.exists(old_avatar) and 'default' not in old_avatar:
        os.remove(old_avatar)
    
    filename = secure_filename(f"avatar_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
              ('avatar', f'static/uploads/{filename}'))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'path': f'static/uploads/{filename}'})

@app.route('/api/check-auth')
def api_check_auth():
    return jsonify({'authenticated': 'logged_in' in session})

if __name__ == '__main__':
    app.run(debug=True) 