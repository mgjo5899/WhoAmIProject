const SignedInSecure = (props, link) => {
    !props.auth.user.email && props.history.push(link);
}

export default SignedInSecure;