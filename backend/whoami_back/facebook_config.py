from whoami_back.config import HOSTNAME, FRONTEND_PORT, BACKEND_PORT


API_HOSTNAME = 'https://graph.facebook.com'
ACCESS_TOKEN_REDIRECT_URI = '{}:{}/facebook/get_access_token'.format(HOSTNAME, BACKEND_PORT)
ACCESS_TOKEN_ENDPOINT = '{}/v3.2/oauth/access_token'.format(API_HOSTNAME)
USER_PHOTOS_ENDPOINT = '{}/me/photos'.format(API_HOSTNAME)
CLIENT_ID = 'YOUR_CLIENT_ID'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
STATE = 'gnsalswjddma'
FIELDS = 'link,images'
TYPE = 'uploaded'
OAUTH_RESULT_ENDPOINT = '{}:{}/oauth_redirect'.format(HOSTNAME, FRONTEND_PORT)
