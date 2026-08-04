import json
from urllib import request, error

url = 'http://192.168.1.10:8000/api/token/'
data = json.dumps({'username': 'admin', 'password': 'Admin123!'}).encode('utf-8')
req = request.Request(url, data=data, headers={'Content-Type': 'application/json'})
try:
    with request.urlopen(req, timeout=10) as r:
        print('STATUS', r.status)
        print(r.read().decode())
except error.HTTPError as e:
    print('HTTP', e.code)
    print(e.read().decode())
except Exception as e:
    print('ERR', repr(e))
