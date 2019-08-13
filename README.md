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

If for some reason you want to access the `officeConfig` (the object where all this data is stored) it belongs to the `app` object, since this app is build with `loopback` it has some cool `express` features aswell, which let's us access the `app` object so whenever you want

## About the Google Auth Endpoint

Since it's an overkill to create an auth model to only manage google login, we created this `loopback.Router` to simulate an api endpoint.

```sh
$ curl https:[BASE_URL]/api/v2/auth/googlelogin
```

### Geting my auth token

TODO

### Extending Models

TODO

### About de `user` model

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
