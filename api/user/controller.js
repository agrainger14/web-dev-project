const {
  createUser, 
  readUserByUsername,
  readUserDetails,
  deleteUserDetails
} = require("./service");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function userSignup(req, res) {
  try {
    const body = req.body;
    const salt = bcrypt.genSaltSync();

    if (!body.username || !body.password) { 
      throw new Error("Invalid details provided!");
    }

    if (!body.first_name) {
      body.first_name = null;
    }

    body.password = bcrypt.hashSync(body.password, salt);

    const [result] = await createUser(body);

    if (!result.affectedRows) { 
      throw new Error("Error inserting record!");
    }

    return res.status(201).json({
      success: true,
      message: "User signup successful!",
    });

  } catch (err) {
    if (err.errno === 1062) {
      return res.status(200).json({
        message: `Username has already been registered!`
      });
    }
    return res.status(400).json({
      message: err.message
    });
  }
};

async function userLogin(req, res) {
  try { 
    const body = req.body;

    if (!body.username) {
      throw new Error("No body provided!");
    }

  
    const [rows, fields] = await readUserByUsername(body.username);

    if (!rows) {
      throw new Error("User does not exist!")
    }

    const passwordCheck = bcrypt.compareSync(body.password, rows[0].password);
  
    if (passwordCheck) {
      delete rows[0].password;

      const token = jwt.sign({ result: rows[0]}, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
      });
  
      await res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,      //set to false to test with postman
        maxAge: 604800000
      });

      return res.status(201).json({
        loggedin: true,
        message: "login successful!",
      });

    } else {
      throw new Error("Invalid username/password combination!")
    }
  
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
};

async function getUserDetails(req, res) {
  try {
    const user_id = req.results.user_id;
    const [row, fields] = await readUserDetails(user_id);

    if (!row) {
      throw new Error("Invalid user ID!");
    }

    return res.status(200).json({
      message: row
    })

  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
};

async function deleteUser(req, res) {
  try {
    const token_user_id = req.results.user_id;
      
    const [result, fields] = await deleteUserDetails(token_user_id);

    if (!result.affectedRows) {
      throw new Error("Invalid ID! User does not exist!");
    }

    return res.status(201).clearCookie('token').json({
      message: "Account and all associated moods successfully deleted."
    })

  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
};

async function userLogout(req, res) {
  try {
    return res.clearCookie('token').status(200).json({
      loggedin: false,
      message: "Logout successful!"
    });
  } catch (err) {
    return res.status(400).json( {
      message: err.message
    })
  }
};

  module.exports = { userSignup, userLogin, getUserDetails, deleteUser, userLogout};