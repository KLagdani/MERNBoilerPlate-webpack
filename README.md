![ScreenShot](/client/public/img/screen.png)

# MERN Auth Boiler Plate

This is a Boiler Plate for authentication developed with the MERN stack.

You can check the demo here :
[Demo](https://mern-kl-boilerplate.herokuapp.com/)

## Get started

Clone the project in your chosen directory, and run:

### `npm install`

### `npm run client-install`

## Setting the app

You will need to first add your environment variables:

`MongoURI:` Your MongoDB Link

`JWT_SECRET:` Secret used for jwt.sign

`NODEMAILER_USER:` User used for sending confirmation emails

`NODEMAILER_PASS:` Password used for sending confirmation emails

`NODEMAILER_HOST:` The host of your app that will be sent in the confirmation email along with the confirmation token

## Running the app

### `npm run dev`

Will run the app in development mode

### `npm run server`

Will run the app for production

**Note that:** For production React Front End is served in static mode so make sure to build it first: `cd client` and `npm run build`

## Testing the app

### `npm run test-watch`

Will run tests in watch mode

### `npm run test`

Will run tests in simple mode

## For Heroku production

A heroku-postbuild script is added in the package.json, so you can deploy your app on heroku.

`heroku cerate your-app-name`

`git push heroku master`

Don't forget to set your environment variables for production in heroku:

`heroku config:set VAR_NAME=VAR_VALUE`

Enjoy and drop me a star if you end up using this project.

[© Kaoutar Lagdani](https://lagdani.com/)
