import InstagramLogo from './images/instagram/instagram-logo.png';
import FacebookLogo from './images/facebook/facebook-logo.png';

const SERVER_HOSTNAME = 'http://localhost';
const SERVER_PORT = 8000;
export const SERVER = `${SERVER_HOSTNAME}:${SERVER_PORT}`;
export const SECRET_KEY = "gnsalswjddma"; // 훈민정음

const SOCIAL_MEDIAS = [
    {
        medium: 'instagram',
        backgroundBorderColor: 'radial-gradient(circle at 33% 100%, #fed373 4%, #f15245 30%, #d92e7f 62%, #9b36b7 85%, #515ecf)',
        clientId: 'c8fdd62c5cdd4b26a25c13f98b222e08',
        authURL: (clientId, authRedirectUri) => `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${authRedirectUri}&response_type=code`,
        src: InstagramLogo
    }, {
        medium: 'facebook',
        backgroundBorderColor: '#3C5A99',
        clientId: '1050432755165601',
        authURL: (clientId, authRedirectUri) => `https://www.facebook.com/v3.2/dialog/oauth?client_id=${clientId}&redirect_uri=${authRedirectUri}&state=${SECRET_KEY}&scope=user_photos`,
        src: FacebookLogo
    }
];

export const SOCIAL_MEDIA_CONFIG = SOCIAL_MEDIAS.map(({ medium, backgroundBorderColor, clientId, authUrl, src }) => ({
    medium,
    backgroundBorderColor,
    link: `${medium}/user_data`,
    clientId,
    authRedirectUri: `${SERVER}/${medium}/get_access_token`,
    authUrl,
    src,
    contents: `${medium}_contents`,
    sourceUrl: `${medium}_url`,
    specific: `${medium}_specific`,
}));