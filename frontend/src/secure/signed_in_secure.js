const signedInSecure = ({ auth, history }, link) => {
    !auth.user.email && history.push(link);
}

export default signedInSecure;