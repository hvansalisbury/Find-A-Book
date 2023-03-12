// require jsonwebtoken
const jwt = require('jsonwebtoken');
// define secret and expiration
const secret = 'mysecretsshhhhh';
const expiration = '2h';
// export authMiddleware and signToken
module.exports = {
  // function for authentication middleware
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // if token is sent via headers, remove the 'Bearer' string
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    // if no token, return request object as is
    if (!token) {
      return req;
    }
    // if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    return req;
  },
  // function for signing tokens
  signToken: function ({ username, email, _id }) {
    // define payload
    const payload = { username, email, _id };
    // return signed token
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};