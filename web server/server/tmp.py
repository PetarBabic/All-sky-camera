import requests

url = 'http://192.168.0.101:3000/api/images'
myobj = {'somekey': 'somevalue'}

file_path = '/Users/petarbabic/Library/Mobile Documents/com~apple~CloudDocs/Faks/SpaceMaster/Aalto/Projects/All-sky-camera/web server/server/images/2026-09-11/full/2034-05.jpg'

with open(file_path, 'rb') as f:
    r = requests.post(
        url,
        files={'file': ('2034-05.jpg', f, 'image/jpeg')}
    )

print(r.text)