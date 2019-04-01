from whoami_back.config import HOSTNAME, FRONTEND_PORT, BACKEND_PORT


API_HOSTNAME = 'https://graph.facebook.com'
ACCESS_TOKEN_REDIRECT_URI = '{}:{}/facebook/get_access_token'.format(HOSTNAME, BACKEND_PORT)
ACCESS_TOKEN_ENDPOINT = '{}/v3.2/oauth/access_token'.format(API_HOSTNAME)
USER_PHOTOS_ENDPOINT = '{}/me/photos'.format(API_HOSTNAME)
CLIENT_ID = '1050432755165601'
CLIENT_SECRET = '63600b798b18918d188f1879ae2568aa'
STATE = 'gnsalswjddma'
FIELDS = 'link,images'
TYPE = 'uploaded'
OAUTH_RESULT_ENDPOINT = '{}:{}/oauth_redirect'.format(HOSTNAME, FRONTEND_PORT)
