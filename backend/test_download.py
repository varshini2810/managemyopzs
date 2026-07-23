import urllib.request
import json

data = json.dumps({'email': 'admin@billingplatform.com', 'password': 'Admin@123'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8080/api/auth/login', data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        print(res_data)
        token = res_data.get('data', {}).get('accessToken') or res_data.get('data', {}).get('token') or res_data.get('token')
except Exception as e:
    print(f'Login failed: {e}')
    exit(1)

req2 = urllib.request.Request('http://localhost:8080/api/invoices/INV-10020/download', headers={'Authorization': f'Bearer {token}'})
try:
    with urllib.request.urlopen(req2) as response:
        print('Success! HTTP ' + str(response.getcode()))
except urllib.error.HTTPError as e:
    print(f'Download failed: {e.code}')
    print(e.read().decode('utf-8'))
