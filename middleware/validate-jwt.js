// Here is where the token is created using the jsonwebtoken package.  The token is an identifier that we can add to the body of a request.  The token establishes permissions to access parts of the code.

const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');

const validateJWT = async (req, res, next) => {
  // pre-flight request with pinging the server
  if (req.method === 'OPTIONS') {
    next();
  } else if (req.headers.authorization) {
    const { authorization } = req.headers;
    const payload = authorization
      ? // verify is decoding
        jwt.verify(authorization, process.env.JWT_SECRET)
      : undefined;

    if (payload) {
      const foundUser = await UserModel.findOne({
        where: {
          id: payload.id,
        },
      });

      if (foundUser) {
        // we are creating the user property
        // giving the code access to the user information
        // by passing the req.user variable passed to the controllers
        req.user = foundUser;
        next();
      } else {
        // user not found with the token
        res.status(400).send({ message: 'Not Authorized' });
      }
    } else {
      // 401 if the token has NOT been successfully de-coded
      res.status(401).send({ message: 'Invalid token' });
    }
  } else {
    // 403 where the headers / authorization was not provided with the token
    res.status(403).send({ message: 'Forbidden' });
  }
};

module.exports = validateJWT;
