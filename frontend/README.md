# Client side

This directory is the client side of this project. It is made of React, using bootstrap framework to visualize.

## Getting Started

Client side of this project includes the way to run client server, install necessary modules to load

### Prerequisites

You should have your machine installed Node.js to start your client server. Once you install Node.js, you can check your Node.js version by executing this command.

```
node -v
```

If this command does not make an error, you are ready to go.

### Installing

Before loading your client server, you should have your package installed. You can install your package by executing this command.

```
npm install
```

After you finished installing node modules, you can now run command

```
npm start
```

## Router path

### Home [ `/` ]

This route goes to very first home page. In the home page, you can sign in, or sign up. Once you sign up, you will need to validate your account using email of your input.

### Dashboard [ `/:username` ]

Once you validate your email, you will be able to go to your username homepage. If you go to home page(`/`), you will automatically redirect to your account page. You will be able to visit other user's dashboard by changing `username`, but if you type `username` that does not exist, then you will redirect to error page.

### Resetting password [ `/reset_pw` ]

This route makes you go to password reset of your account. This page should only be able to access once you request for change password. If you join into this page with no session in your browser, you will go to error page.

### Error page [ `/error_page ]

This page is a general error page of this project. If you pass the parameter of this page msg, for example, `/error_page?msg=Wrong`, then you will be able to see message in the error page. This message is from backend error message.

### OAuth redirect [ `/oauth_redirect` ]

This page is when you try to register OAuth from each social media. After backend stores access token in the server, server will redirect to this route with the parameter `status`, which will indicate either `true` or `false`.