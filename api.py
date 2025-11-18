# -*- coding: utf-8 -*-
from flask import Flask, render_template_string, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# HTML Template for testing
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار Discord Username API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        h1 {
            color: #5865F2;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2em;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #2c3e50;
            font-weight: 600;
            font-size: 14px;
        }
        
        input, textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e1e8ed;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: #5865F2;
            box-shadow: 0 0 0 3px rgba(88, 101, 242, 0.1);
        }
        
        textarea {
            resize: vertical;
            min-height: 120px;
        }
        
        .hint {
            font-size: 12px;
            color: #7289da;
            margin-top: 5px;
        }
        
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #5865F2 0%, #7289da 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 10px;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(88, 101, 242, 0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        button:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            transform: none;
        }
        
        #results {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            display: none;
        }
        
        .result-item {
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Courier New', monospace;
        }
        
        .available {
            background: #d4edda;
            border-right: 4px solid #28a745;
        }
        
        .taken {
            background: #f8d7da;
            border-right: 4px solid #dc3545;
        }
        
        .error {
            background: #fff3cd;
            border-right: 4px solid #ffc107;
        }
        
        .status {
            font-weight: 600;
            padding: 5px 15px;
            border-radius: 5px;
            font-size: 12px;
        }
        
        .status.available {
            background: #28a745;
            color: white;
        }
        
        .status.taken {
            background: #dc3545;
            color: white;
        }
        
        .status.error {
            background: #ffc107;
            color: #333;
        }
        
        .loading {
            text-align: center;
            padding: 20px;
            color: #5865F2;
        }
        
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #5865F2;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 10px;
            border-right: 4px solid #dc3545;
            margin-top: 20px;
        }
        
        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 10px;
            border-right: 4px solid #28a745;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 اختبار Discord Username API</h1>
        
        <form id="apiForm">
            <div class="form-group">
                <label for="apiKey">API Key:</label>
                <input type="text" id="apiKey" name="apiKey" required 
                       placeholder="أدخل API Key الخاص بك">
                <div class="hint">يمكنك الحصول على API Key من لوحة التحكم</div>
            </div>
            
            <div class="form-group">
                <label for="tokenName">Token Name:</label>
                <input type="text" id="tokenName" name="tokenName" required 
                       placeholder="أدخل اسم التوكن">
                <div class="hint">اسم التوكن المسجل في حسابك</div>
            </div>
            
            <div class="form-group">
                <label for="usernames">Usernames (حد أقصى 10):</label>
                <textarea id="usernames" name="usernames" required 
                          placeholder="أدخل اليوزرات (واحد في كل سطر)&#10;مثال:&#10;username1&#10;username2&#10;username3"></textarea>
                <div class="hint">أدخل كل يوزر في سطر منفصل (حد أقصى 10 يوزرات)</div>
            </div>
            
            <button type="submit" id="submitBtn">فحص الأسماء</button>
        </form>
        
        <div id="results"></div>
    </div>
    
    <script>
        document.getElementById('apiForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const apiKey = document.getElementById('apiKey').value.trim();
            const tokenName = document.getElementById('tokenName').value.trim();
            const usernamesText = document.getElementById('usernames').value.trim();
            const usernames = usernamesText.split('\\n').map(u => u.trim()).filter(u => u);
            
            if (usernames.length === 0) {
                alert('الرجاء إدخال اسم مستخدم واحد على الأقل');
                return;
            }
            
            if (usernames.length > 10) {
                alert('الحد الأقصى 10 أسماء مستخدم');
                return;
            }
            
            const resultsDiv = document.getElementById('results');
            const submitBtn = document.getElementById('submitBtn');
            
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>جاري الفحص...</p></div>';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        api_key: apiKey,
                        token_name: tokenName,
                        usernames: usernames
                    })
                });
                
                const data = await response.json();
                
                if (data.error) {
                    resultsDiv.innerHTML = `<div class="error-message"><strong>خطأ:</strong> ${data.error}</div>`;
                } else {
                    let html = '<h3 style="margin-bottom: 15px; color: #2c3e50;">النتائج:</h3>';
                    
                    data.results.forEach(result => {
                        const statusClass = result.available ? 'available' : 
                                          result.error ? 'error' : 'taken';
                        const statusText = result.available ? 'متاح ✓' : 
                                         result.error ? 'خطأ ⚠' : 'محجوز ✗';
                        
                        html += `
                            <div class="result-item ${statusClass}">
                                <span style="font-size: 16px;">${result.username}</span>
                                <span class="status ${statusClass}">${statusText}</span>
                            </div>
                        `;
                    });
                    
                    if (data.remaining_requests !== undefined) {
                        html += `<div class="success-message" style="margin-top: 20px;">
                            الطلبات المتبقية اليوم: <strong>${data.remaining_requests}/${data.daily_limit}</strong>
                        </div>`;
                    }
                    
                    resultsDiv.innerHTML = html;
                }
            } catch (error) {
                resultsDiv.innerHTML = `<div class="error-message"><strong>خطأ في الاتصال:</strong> ${error.message}</div>`;
            } finally {
                submitBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    """عرض صفحة الاختبار"""
    return render_template_string(HTML_TEMPLATE), 200, {'Content-Type': 'text/html; charset=utf-8'}

@app.route('/check', methods=['POST'])
def check_usernames():
    """استدعاء API للفحص"""
    try:
        data = request.get_json()
        
        api_key = data.get('api_key')
        token_name = data.get('token_name')
        usernames = data.get('usernames', [])
        
        if not api_key or not token_name or not usernames:
            return jsonify({'error': 'جميع الحقول مطلوبة'}), 400, {'Content-Type': 'application/json; charset=utf-8'}
        
        if len(usernames) > 10:
            return jsonify({'error': 'الحد الأقصى 10 أسماء مستخدم'}), 400, {'Content-Type': 'application/json; charset=utf-8'}
        
        # استدعاء Supabase Edge Function
        edge_function_url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'
        
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': api_key,
            'x-token-name': token_name
        }
        
        payload = {
            'usernames': usernames
        }
        
        response = requests.post(
            edge_function_url,
            headers=headers,
            json=payload,
            timeout=60
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {response.headers}")
        print(f"Response text: {response.text[:200]}")  # First 200 chars for debugging
        
        if response.status_code == 200:
            try:
                return jsonify(response.json()), 200, {'Content-Type': 'application/json; charset=utf-8'}
            except Exception as e:
                return jsonify({'error': f'خطأ في قراءة الاستجابة: {str(e)}'}), 500, {'Content-Type': 'application/json; charset=utf-8'}
        else:
            try:
                error_data = response.json()
                error_msg = error_data.get('error', f'خطأ من الخادم: {response.status_code}')
            except:
                error_msg = f'خطأ من الخادم: {response.status_code} - {response.text[:100]}'
            
            return jsonify({'error': error_msg}), response.status_code, {'Content-Type': 'application/json; charset=utf-8'}
            
    except requests.exceptions.Timeout:
        return jsonify({'error': 'انتهت مهلة الطلب. حاول مرة أخرى.'}), 408, {'Content-Type': 'application/json; charset=utf-8'}
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'خطأ في الاتصال: {str(e)}'}), 500, {'Content-Type': 'application/json; charset=utf-8'}
    except Exception as e:
        return jsonify({'error': f'خطأ غير متوقع: {str(e)}'}), 500, {'Content-Type': 'application/json; charset=utf-8'}

if __name__ == '__main__':
    print('=' * 50)
    print('🚀 خادم Flask يعمل الآن!')
    print('📍 افتح المتصفح على: http://localhost:5000')
    print('=' * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
