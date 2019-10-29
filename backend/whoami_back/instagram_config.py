from whoami_back.config import HOSTNAME, FRONTEND_PORT, BACKEND_PORT


API_HOSTNAME = 'https://api.instagram.com'
ACCESS_TOKEN_REDIRECT_URI = '{}:{}/instagram/get_access_token'.format(HOSTNAME, BACKEND_PORT)
ACCESS_TOKEN_ENDPOINT = '{}/oauth/access_token'.format(API_HOSTNAME)
USER_MEDIA_ENDPOINT = '{}/v1/users/self/media/recent'.format(API_HOSTNAME)
CLIENT_ID = 'YOUR_CLIENT_ID'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
GRANT_TYPE = 'authorization_code'
OAUTH_RESULT_ENDPOINT = '{}:{}/oauth_redirect'.format(HOSTNAME, FRONTEND_PORT)
