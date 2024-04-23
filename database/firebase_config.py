import firebase_admin
from firebase_admin import credentials

def get_firebase_app():
    if not firebase_admin._apps:
        cred_path = "move-1699869988043-firebase-adminsdk-mo28g-2057e0e622.json"
        cred = credentials.Certificate(cred_path)
        return firebase_admin.initialize_app(cred, {
            'storageBucket': 'move-1699869988043.appspot.com'
        })
    else:
        return firebase_admin.get_app()