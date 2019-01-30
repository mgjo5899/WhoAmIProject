export const storeUser = user => {
    return (dispatch,getState) => {
        dispatch({type:'STORE_USER', user});
    }
}