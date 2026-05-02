from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from functools import wraps
import sqlite3
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'tvoy-sekretnyy-klyuch-12345'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def init_db():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)''')
    c.execute('''CREATE TABLE IF NOT EXISTS gallery (id INTEGER PRIMARY KEY AUTOINCREMENT, photo TEXT NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    c.execute('''CREATE TABLE IF NOT EXISTS certificates (id INTEGER PRIMARY KEY AUTOINCREMENT, photo TEXT NOT NULL, title TEXT NOT NULL, description TEXT, organization TEXT, year TEXT, course TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    c.execute('''CREATE TABLE IF NOT EXISTS works (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, icon TEXT DEFAULT 'fa-code', file_path TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    c.execute('''CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS techstack (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, name TEXT NOT NULL, icon TEXT DEFAULT 'fa-code', percent INTEGER DEFAULT 50, subtitle TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)''')
    c.execute('''CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, sort_order INTEGER DEFAULT 0)''')
    c.execute('SELECT COUNT(*) FROM users')
    c.execute('''CREATE TABLE IF NOT EXISTS music 
        ( id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        file_path TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
        )''')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO users (username, password) VALUES (?, ?)', ('ID1Vlad', '43Vl_ad33'))
    c.execute('SELECT COUNT(*) FROM categories')
    if c.fetchone()[0] == 0:
        for i, cat in enumerate(['Программирование и разработка','Офисные приложения','Графика и дизайн','Другие инструменты']):
            c.execute('INSERT INTO categories (name, sort_order) VALUES (?, ?)', (cat, i))
    c.execute('SELECT COUNT(*) FROM techstack')
    if c.fetchone()[0] == 0:
        for item in [
            ('Программирование и разработка','Python','fab fa-python',20,'',0),
            ('Программирование и разработка','HTML/CSS','fas fa-code',35,'',1),
            ('Программирование и разработка','Базы данных','fas fa-database',30,'',2),
            ('Офисные приложения','MS Word','fas fa-file-word',85,'',0),
            ('Офисные приложения','MS Excel','fas fa-file-excel',80,'',1),
            ('Офисные приложения','MS Access','fas fa-database',65,'',2),
            ('Офисные приложения','MS PowerPoint','fas fa-file-powerpoint',75,'',3),
            ('Графика и дизайн','Графические редакторы','fas fa-paint-brush',70,'Photoshop & GIMP',0),
            ('Графика и дизайн','Inkscape','fas fa-vector-square',65,'',1),
            ('Другие инструменты','Текстовые редакторы','fas fa-edit',90,'Блокнот • Notepad++',0),
            ('Другие инструменты','Нейросети','fas fa-brain',70,'ChatGPT • Midjourney',1),
            ('Другие инструменты','Интернет-поиск','fas fa-search',85,'',2),
        ]:
            c.execute('INSERT INTO techstack (category, name, icon, percent, subtitle, sort_order) VALUES (?, ?, ?, ?, ?, ?)', item)
    conn.commit()
    conn.close()

init_db()

def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if 'logged_in' not in session: return redirect(url_for('login'))
        return f(*args, **kwargs)
    return wrapper

def get_setting(key):
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT value FROM settings WHERE key = ?', (key,))
    row = c.fetchone()
    conn.close()
    return row[0] if row else None

@app.route('/')
def index():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT * FROM gallery ORDER BY created_at DESC')
    gallery = c.fetchall()
    c.execute('SELECT * FROM certificates ORDER BY created_at DESC')
    certificates = c.fetchall()
    c.execute('SELECT * FROM works ORDER BY created_at DESC')
    works = c.fetchall()
    c.execute('SELECT * FROM categories ORDER BY sort_order ASC')
    categories = c.fetchall()
    c.execute('SELECT * FROM techstack ORDER BY sort_order ASC')
    techstack = c.fetchall()
    avatar = get_setting('avatar') or 'static/uploads/default_avatar.jpg'
    conn.close()
    return render_template('index.html', gallery=gallery, certificates=certificates, works=works, categories=categories, techstack=techstack, avatar=avatar)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        conn = sqlite3.connect('portfolio.db')
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE username = ? AND password = ?', (request.form['username'], request.form['password']))
        user = c.fetchone()
        conn.close()
        if user:
            session['logged_in'] = True
            session['username'] = request.form['username']
            return redirect(url_for('admin'))
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

# GALLERY API
@app.route('/api/gallery', methods=['GET'])
def api_gallery(): 
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT * FROM gallery ORDER BY created_at DESC')
    items = [{'id':r[0],'photo':r[1],'description':r[2]} for r in c.fetchall()]
    conn.close(); return jsonify(items)

@app.route('/api/gallery', methods=['POST'])
def api_gallery_add():
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    f = request.files['photo']
    fn = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{f.filename}")
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('INSERT INTO gallery (photo, description) VALUES (?, ?)', (f'static/uploads/{fn}', request.form.get('description','')))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/gallery/<int:id>', methods=['DELETE'])
def api_gallery_del(id):
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT photo FROM gallery WHERE id=?', (id,))
    row = c.fetchone()
    if row and os.path.exists(row[0]): os.remove(row[0])
    c.execute('DELETE FROM gallery WHERE id=?', (id,))
    conn.commit(); conn.close()
    return jsonify({'success':True})

# CERTIFICATES API
@app.route('/api/certificates', methods=['GET'])
def api_certs():
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT * FROM certificates ORDER BY created_at DESC')
    items = [{'id':r[0],'photo':r[1],'title':r[2],'description':r[3],'organization':r[4],'year':r[5],'course':r[6]} for r in c.fetchall()]
    conn.close(); return jsonify(items)

@app.route('/api/certificates', methods=['POST'])
def api_certs_add():
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    f = request.files['photo']
    fn = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{f.filename}")
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('INSERT INTO certificates (photo, title, description, organization, year, course) VALUES (?,?,?,?,?,?)',
              (f'static/uploads/{fn}', request.form.get('title',''), request.form.get('description',''), request.form.get('organization',''), request.form.get('year',''), request.form.get('course','1')))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/certificates/<int:id>', methods=['DELETE'])
def api_certs_del(id):
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT photo FROM certificates WHERE id=?', (id,))
    row = c.fetchone()
    if row and os.path.exists(row[0]): os.remove(row[0])
    c.execute('DELETE FROM certificates WHERE id=?', (id,))
    conn.commit(); conn.close()
    return jsonify({'success':True})

# WORKS API
@app.route('/api/works', methods=['GET'])
def api_works():
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT * FROM works ORDER BY created_at DESC')
    items = [{'id':r[0],'title':r[1],'description':r[2],'icon':r[3],'file_path':r[4]} for r in c.fetchall()]
    conn.close(); return jsonify(items)

@app.route('/api/works', methods=['POST'])
def api_works_add():
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    fp = None
    if 'file' in request.files and request.files['file'].filename:
        f = request.files['file']
        fn = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{f.filename}")
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
        fp = f'static/uploads/{fn}'
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('INSERT INTO works (title, description, icon, file_path) VALUES (?,?,?,?)',
              (request.form.get('title',''), request.form.get('description',''), request.form.get('icon','fa-code'), fp))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/works/<int:id>', methods=['DELETE'])
def api_works_del(id):
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT file_path FROM works WHERE id=?', (id,))
    row = c.fetchone()
    if row and row[0] and os.path.exists(row[0]): os.remove(row[0])
    c.execute('DELETE FROM works WHERE id=?', (id,))
    conn.commit(); conn.close()
    return jsonify({'success':True})

# TECHSTACK API
@app.route('/api/techstack', methods=['GET'])
def api_ts():
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT * FROM techstack ORDER BY sort_order')
    items = [{'id':r[0],'category':r[1],'name':r[2],'icon':r[3],'percent':r[4],'subtitle':r[5],'sort_order':r[6]} for r in c.fetchall()]
    conn.close(); return jsonify(items)

@app.route('/api/techstack', methods=['POST'])
def api_ts_add():
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    d = request.get_json()
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT MAX(sort_order) FROM techstack WHERE category=?', (d.get('category',''),))
    mo = (c.fetchone()[0] or 0) + 1
    c.execute('INSERT INTO techstack (category, name, icon, percent, subtitle, sort_order) VALUES (?,?,?,?,?,?)',
              (d.get('category',''), d.get('name',''), d.get('icon','fa-code'), d.get('percent',50), d.get('subtitle',''), mo))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/techstack/<int:id>', methods=['PUT'])
def api_ts_upd(id):
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    d = request.get_json()
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('UPDATE techstack SET name=?,icon=?,percent=?,subtitle=?,category=?,sort_order=? WHERE id=?',
              (d.get('name',''), d.get('icon',''), d.get('percent',50), d.get('subtitle',''), d.get('category',''), d.get('sort_order',0), id))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/techstack/<int:id>', methods=['DELETE'])
def api_ts_del(id):
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('DELETE FROM techstack WHERE id=?', (id,))
    conn.commit(); conn.close()
    return jsonify({'success':True})

# CATEGORIES API
@app.route('/api/categories', methods=['GET'])
def api_cats():
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT * FROM categories ORDER BY sort_order')
    items = [{'id':r[0],'name':r[1],'sort_order':r[2]} for r in c.fetchall()]
    conn.close(); return jsonify(items)

@app.route('/api/categories', methods=['POST'])
def api_cats_add():
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    d = request.get_json()
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('SELECT MAX(sort_order) FROM categories')
    mo = (c.fetchone()[0] or 0) + 1
    c.execute('INSERT INTO categories (name, sort_order) VALUES (?,?)', (d.get('name',''), mo))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/categories/<int:id>', methods=['PUT'])
def api_cats_upd(id):
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    d = request.get_json()
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('UPDATE categories SET name=?, sort_order=? WHERE id=?', (d.get('name',''), d.get('sort_order',0), id))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/categories/<int:id>', methods=['DELETE'])
def api_cats_del(id):
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('DELETE FROM categories WHERE id=?', (id,))
    conn.commit(); conn.close()
    return jsonify({'success':True})

# AVATAR
@app.route('/api/avatar', methods=['POST'])
def api_avatar():
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    f = request.files['avatar']
    old = get_setting('avatar')
    if old and os.path.exists(old) and 'default' not in old: os.remove(old)
    fn = secure_filename(f"avatar_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?,?)', ('avatar', f'static/uploads/{fn}'))
    conn.commit(); conn.close()
    return jsonify({'success':True})

# MUSIC API
@app.route('/api/music', methods=['GET'])
def api_music_list():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT * FROM music ORDER BY sort_order ASC')
    items = [{'id': r[0], 'title': r[1], 'file_path': r[2], 'sort_order': r[3]} for r in c.fetchall()]
    conn.close()
    return jsonify(items)

@app.route('/api/music', methods=['POST'])
def api_music_add():
    if 'logged_in' not in session: return jsonify({'error': 'Auth'}), 401
    if 'file' not in request.files: return jsonify({'error': 'No file'}), 400
    f = request.files['file']
    if f.filename == '': return jsonify({'error': 'Empty'}), 400
    fn = secure_filename(f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{f.filename}")
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT MAX(sort_order) FROM music')
    mo = (c.fetchone()[0] or 0) + 1
    c.execute('INSERT INTO music (title, file_path, sort_order) VALUES (?, ?, ?)',
              (request.form.get('title', fn), f'static/uploads/{fn}', mo))
    conn.commit(); conn.close()
    return jsonify({'success': True})

@app.route('/api/music/<int:id>', methods=['DELETE'])
def api_music_del(id):
    if 'logged_in' not in session: return jsonify({'error': 'Auth'}), 401
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT file_path FROM music WHERE id=?', (id,))
    row = c.fetchone()
    if row and os.path.exists(row[0]): os.remove(row[0])
    c.execute('DELETE FROM music WHERE id=?', (id,))
    conn.commit(); conn.close()
    return jsonify({'success': True})

# CHANGE PASSWORD
@app.route('/api/change-password', methods=['POST'])
def api_chpass():
    if 'logged_in' not in session: return jsonify({'error':'Auth'}), 401
    d = request.get_json()
    if len(d.get('password','')) < 3: return jsonify({'error':'Короткий'}), 400
    conn = sqlite3.connect('portfolio.db'); c = conn.cursor()
    c.execute('UPDATE users SET password=? WHERE username=?', (d['password'], session['username']))
    conn.commit(); conn.close()
    return jsonify({'success':True})

@app.route('/api/check-auth')
def api_check(): return jsonify({'authenticated':'logged_in' in session})

if __name__ == '__main__':
    app.run(debug=True)