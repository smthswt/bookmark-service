from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import secrets
import sqlite3
from flasgger import Swagger

app = Flask(__name__)
CORS(app)
# Swagger 설정
swagger = Swagger(app)

@app.route('/api/swagger-docs', methods=['GET'])
def hello():

    return jsonify(message="Hello, World!")

# 랜덤 키 생성, 길이 최소 32바이트 / 더 보안적으로 신경 쓸거면 아예 환경 변수에서 키를 가져와야함.
# 이 프로젝트에선 시간 부족으로 그렇게까지 안 함.
def generate_secret_key(length=32):
    return secrets.token_urlsafe(length)

app.config['SECRET_KEY'] = generate_secret_key()
app.config['REFRESH_SECRET_KEY'] = generate_secret_key()

print(f'Access Token Key: {app.config["SECRET_KEY"]}')
print(f'Refresh Token Key: {app.config["REFRESH_SECRET_KEY"]}')

@app.route('/')
def home():  # put application's code here
    return 'flask homepage'

# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     username = data.get('username')
#     password = data.get('password')
#     if username == "asdf" and password == "asdf":
#         return jsonify({"success": True, "message": "아이디와 비번이 일치합니다."})
#     else :
#         return jsonify({"success": False, "message": "아이디와 비번이 불일치합니다."})


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if username == 'asdf' and password == 'asdf':
            access_payload = {
                'username': username,
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }
            refresh_payload = {
                'username': username,
                'exp': datetime.utcnow() + timedelta(days=7)  # 리프레시 토큰은 더 긴 만료 시간
            }
            access_token = jwt.encode(access_payload, app.config['SECRET_KEY'], algorithm='HS256')
            refresh_token = jwt.encode(refresh_payload, app.config['REFRESH_SECRET_KEY'], algorithm='HS256')
            return jsonify({
                "success": True,
                "message": "아이디와 비번이 일치합니다.",
                'access_token': access_token,
                'refresh_token': refresh_token
            })
        else:
            return jsonify({'error': '아이디 또는 비밀번호가 잘못되었습니다.',
                            "success": False,
                            "message": "아이디와 비번이 불일치합니다."}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/refresh', methods=['POST'])
def refresh():
    try:
        refresh_token = request.get_json().get('refresh_token')
        payload = jwt.decode(refresh_token, app.config['REFRESH_SECRET_KEY'], algorithms=['HS256'])
        new_access_payload = {
            'username': payload['username'],
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }
        new_access_token = jwt.encode(new_access_payload, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'access_token': new_access_token})
    except jwt.ExpiredSignatureError:
        return jsonify({'error': '리프레시 토큰이 만료되었습니다.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': '유효하지 않은 토큰입니다.'}), 401


@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({'message': '로그아웃 되었습니다.'}), 200

@app.route('/api/save_places', methods=['POST'])
def savePlacesToSQL():
    conn = sqlite3.connect('bookmark_db.db', timeout=10)
    cursor = conn.cursor()

    create_table_query = '''
    CREATE TABLE IF NOT EXISTS places (
        store_Name TEXT NOT NULL PRIMARY KEY,
        store_Address TEXT NOT NULL,
        store_Contact TEXT NOT NULL
    )
    '''
    cursor.execute(create_table_query)

    data = request.get_json()
    storeName = data.get('storeName')
    storeAddress = data.get('storeAddress')
    storeContact = data.get('storeContact')

    insert_query = '''
    INSERT OR REPLACE INTO places (store_Name, store_Address, store_Contact)
    VALUES (?, ?, ?)
    '''
    cursor.execute(insert_query, (storeName, storeAddress, storeContact))

    conn.commit()
    conn.close()

    return jsonify({'save' : "true", '가게 이름' : storeName, '주소': storeAddress, '전화번호' : storeContact}), 200


@app.route('/api/get_all_places', methods=['GET'])
def get_all_places():
    conn = sqlite3.connect('bookmark_db.db', timeout=10)

    cursor = conn.cursor()
    cursor.execute('SELECT * FROM places')
    rows = cursor.fetchall()
    # for row in rows:
    #     print(row)
    conn.close()

    # Convert rows to list of dictionaries
    places = [{"store_Name": row[0], "store_Address": row[1], "store_Contact": row[2]} for row in rows]

    return jsonify({'places' : places}), 200


@app.route('/api/save_links', methods=['POST'])
def saveLinksToSQL():
    conn = sqlite3.connect('bookmark_db.db', timeout=10)
    cursor = conn.cursor()

    create_table_query = '''
    CREATE TABLE IF NOT EXISTS links (
        site_name TEXT NOT NULL,
        site_url TEXT NOT NULL PRIMARY KEY
    )
    '''
    cursor.execute(create_table_query)

    data = request.get_json()
    siteName = data.get('site_name')
    siteUrl = data.get('site_url')

    insert_query = '''
    INSERT OR REPLACE INTO links (site_name, site_url)
    VALUES (?, ?)
    '''
    cursor.execute(insert_query, (siteName, siteUrl))

    conn.commit()
    conn.close()

    return jsonify({'save' : "true", '바로가기 이름' : siteName, '바로가기 주소' : siteUrl}), 200


@app.route('/api/get_all_links', methods=['GET'])
def get_all_links():
    conn = sqlite3.connect('bookmark_db.db', timeout=10)

    cursor = conn.cursor()
    cursor.execute('SELECT * FROM links')
    rows = cursor.fetchall()
    conn.close()

    # Convert rows to list of dictionaries
    links = [{"site_name": row[0], "site_url": row[1]} for row in rows]

    return jsonify({'links' : links}), 200



# flask 서버를 실행해주는 메인 코드?
if __name__ == '__main__':
    app.run(debug=True, port=5000)

# 가상환경 생성
# python3 -m venv venv
# 가상환경 활성화
# source venv/bin/activate
# 설치
# pip install flask
# pip install flask_cors
# pip install PyJWT
# 5000 포트 실행
# flask run

# deactivate
# rm -rf venv
