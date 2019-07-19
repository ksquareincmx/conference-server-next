conference-server-next

## Extending Models

### About de `user` model

Loopback has a default `User` model which is not recommended to work with
so we created a `user` model which will be the official model we use for
this app, remember this when you are working with this app

```js
const { user } = App.models;
```

CAUTION: Do not set the `User.public` to "true" in `server/model-config.json`
