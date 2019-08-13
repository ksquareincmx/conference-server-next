'use strict';

module.exports = App => {
  const { Role } = App.models;

  Role.registerResolver("slack", (role, context, cb) => {

    const denied = () => process.nextTick(() => cb(null, false));
    const granted = (bool = true) => process.nextTick(() => cb(null, bool));

    const { remotingContext: { options: {slackAccess} } } = context;
    if (slackAccess) {
      return granted();
    } else {
      return denied();
    }

  });
};
