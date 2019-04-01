from flask import Flask
from flask_cors import CORS

from whoami_back.utils import db_checks, db_close, init_mail
from whoami_back.config import CREDENTIAL_MAX_TIME, BACKEND_PORT
from whoami_back.config import get_mail_config
from whoami_back.views.auth import auth
from whoami_back.views.instagram import instagram
from whoami_back.views.user import user
from whoami_back.views.whiteboard import whiteboard
from whoami_back.views.facebook import facebook


app = Flask(__name__)

# View functions registration
app.register_blueprint(auth)
app.register_blueprint(instagram)
app.register_blueprint(user)
app.register_blueprint(whiteboard)
app.register_blueprint(facebook)

# Secret key for session
app.secret_key = b'gkdlakdlspdladlwmwhtpq'

# Mail configuration in app context
mail_config = get_mail_config()
for key in mail_config:
    app.config[key] = mail_config[key]

# Cross Origin Resource Sharing (CORS) support for the flask backend
CORS(app=app, supports_credentials=True, max_age=CREDENTIAL_MAX_TIME)


if __name__ == '__main__':
    db_checks()
    init_mail(app)
    app.run(debug=True, host='0.0.0.0', port=BACKEND_PORT)
    db_close()
