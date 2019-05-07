import Axios from 'axios';
import { SERVER } from '../../config';

export const resetData = () => ({
    type: 'RESET_PROFILE'
});

export const setProfile = profile => ({
    type: 'SET_PROFILE',
    profile
});

export const setExistingProfileData = () => {
    return async dispatch => {
        const { profile } = (await Axios.get(SERVER + '/user/profile')).data;

        if (profile) {
            dispatch(setProfile({ ...profile, include_email: profile.email ? true : false }));
        }
    }
}
