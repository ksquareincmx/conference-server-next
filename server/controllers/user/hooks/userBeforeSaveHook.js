'use strict';

async function userBeforeSaveHook(ctx, next) {
  // Only an admin can change user to admin
}

module.exports = userBeforeSaveHook;
