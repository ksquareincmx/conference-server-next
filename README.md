# conference-server-next

Manage conference-rooms for your workplace

## Customize with your workspace time!

the `office-config.js` is where your company custom requirements lives, some of the things you can configure there, are.

| Property   | Default                            | Description                                                                                         |
| ---------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `timezone` | `America/Mexico_City`              | Set your current office timezone (unfortanetly only one timezone is supported for the whole server) |
| `days`     | `[1,2,3,4,5]`                      | An array of numbers with the working days, written in ISOFormat                                     |
| `hours`    | `[{ from: "08:00", to: "18:00" }]` | An array of objects with the working hours                                                          |

**Where do I get that config information**

If for some reason you want to access the `officeConfig` (the object where all this data is stored) it belongs to the `app` object, since this app is build with `loopback` it has some cool `express` features as well, which lets us access the `app` object whenever you want.

## About the Google Auth Endpoint

Since it's an overkill to create an auth model to only manage google login, we created this `loopback.Router` to simulate an api endpoint.

```sh
$ curl https:[BASE_URL]/api/v2/auth/googlelogin
```

### Geting my auth token

TODO

### Extending Models

TODO

### About the `user` model

Loopback has a default `User` model which is not recommended to work with,
so we created an `user` model which will be the official model we use for
this app, please remember this.

```js
const { user } = App.models;
```

CAUTION: Do not set the `User.public` to `"true"` in `server/model-config.json`

### Creating custom AccessTokens

when leading with two words variable names (e.g: `room_id`) we normally go for `snake_case` instead of `camelCase`, the exception to that rule happens with
`AccessToken` class, wich extends from loopbacks default `User` model, so when you are programatically creating an `AccessToken`, remember to do this:

```js
const { AccessToken } = App.models;

AccessToken.create({
  userId: 1 // Put the desired userId and remember to use camelCase only when dealing with AccessToken
})
  .then(accesstoken => {})
  .catch(err => {});
```
### Setting up your .env variables

In order to run the project, you'll have to set up your own environment variables by creating an `.env` file on your root folder. PLease refer to the `.env.example` file to see all the variables you'll need to fill. Please note that some Slack `.env` credentials have the same name but require different values depending on whether they'll be used on production or development.

| Variable                         | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `JWT_SECRET`                     | Your JWT (JSON Web Token) Secret                       |
| `GOOGLE_CLIENT_ID`               | Your Google Client ID                                  |
| `APP_ADMIN_NAME`                 | The name of the app's admin                            |
| `APP_ADMIN_EMAIL`                | The email of the app's admin                           |
| `APP_ADMIN_PASSWORD`             | The password of the app's admin                        |
| `DB_NAME`                        | The name of your database                              |
| `DB_USER`                        | Your database username                                 |
| `DB_PASSWORD`                    | Your database password                                 |
| `KEY_SERVICE_ACCOUNT`            | Your Google's Service Account private key              |
| `SERVICE_ACCOUNT`                | Your Google's Service Account email                    |
| `EMAIL_FROM_ADDRESS`             | The account which will send a booking's confirmation   |
| `REACT_APP_GOOGLE_CLIENT_ID`     | The client's react app Google Client ID                |
| `REACT_APP_SERVER_URI`           | The client's react app server URI                      |
| `SLACK_ACCESS_TOKEN`             | Your Slack App's Access Token                          |
| `SLACK_SIGNING_SECRET`           | Your Slack App's signing secret                        |
| `SLACK_CLIENT_ID`                | Your Slack App's client ID                             |
| `SLACK_CLIENT_SECRET`            | Your Slack App's client secret                         |
| `SLACK_OAUTH_REDIRECT_URI`       | Your Slack App's OAuth Redirect URI                    |
| `SLACK_CALLBACK_URL`             | Your Slack App's Callback URI                          |