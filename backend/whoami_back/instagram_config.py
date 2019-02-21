from whoami_back.config import HOSTNAME, FRONTEND_PORT, BACKEND_PORT


API_HOSTNAME = 'https://api.instagram.com'
ACCESS_TOKEN_REDIRECT_URI = '{}:{}/instagram/get_access_token'.format(HOSTNAME, BACKEND_PORT)
ACCESS_TOKEN_ENDPOINT = '{}/oauth/access_token'.format(API_HOSTNAME)
USER_MEDIA_ENDPOINT = '{}/v1/users/self/media/recent'.format(API_HOSTNAME)
CLIENT_ID = 'c8fdd62c5cdd4b26a25c13f98b222e08'
CLIENT_SECRET = 'ab7c144fa18a467a97300c6377d1e364'
GRANT_TYPE = 'authorization_code'
RESULT_ENDPOINT = '{}:{}/receive/instagram'.format(HOSTNAME, FRONTEND_PORT)
