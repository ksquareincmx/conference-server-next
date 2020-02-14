/**
 * Admin User
 */
const { app } = require("../config/config");
const { make } = require('../services/jwtService');
const { generateRandomValueBase64 } = require('../utils')

// module.exports = App => {
//   const { user } = App.models;
//   user.create(
//     {
//       name: app.admin.name,
//       email: app.admin.email,
//       password: generateRandomValueBase64(20),
//       role: "admin"
//     }, async (err, user) => {
//       if (err) {
//         throw new Error(`Cannot create admin`, err);
//       }

//       console.log('Admin token: ', `"${await make(user)}"`);
            
//     }
//   );
// };
