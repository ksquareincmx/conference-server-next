module.exports.getTokenFromReq = function(req) {
  return (
    req.headers["authorization"] ||
    req.headers["auth"] ||
    req.query.access_token
  );
};
