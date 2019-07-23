conference-server-next

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
