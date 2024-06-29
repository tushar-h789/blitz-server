const jwt = require("jsonwebtoken");

exports.jwToken = (user, expiredIn) => {
  return jwt.sign(
    user, // User payload to encode in the JWT.
    process.env.SECRET_TOKEN, // Secret key to sign the token, stored in environment variables.
    {
      expiresIn: expiredIn, // Token expiration time, defined by the expiredIn parameter.
    }
  );
};
