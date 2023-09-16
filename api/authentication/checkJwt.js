const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
      let token = req.cookies.token;

      if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, results) => {
          if (error) {
            return res.status(400).json({
              message: "Invalid Token!"
            });
          } else {
            req.results = results.result;
            next();
          }
        });
      } else {
        return res.status(401).json({
          message: "Access Denied!"
        });
      }
};

function checkToken(req, res) {
  let token = req.cookies.token

  if (!token) {
      return res.status(200).json({
        loggedin: false
      });
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error) => {
      if (error) {
        res.cookie('token', null, {
        httpOnly: true,
        maxAge: -1
        });
        return res.status(400).json({
          message: "Invalid Token!"
        });
      } else {
        return res.status(200).json({
          loggedin: true
        })
      }
    })
  }
};

module.exports = { authenticateToken, checkToken }