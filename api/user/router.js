const router = require("express").Router();

const { authenticateToken, checkToken } = require("../authentication/checkJwt");

const {
  userSignup,
  userLogin,
  getUserDetails,
  deleteUser,
  userLogout
} = require("./controller");

router.post("/", userSignup);
router.post("/login", userLogin);
router.get("/logout", authenticateToken, userLogout);
router.get("/token", checkToken);
router.delete("/", authenticateToken, deleteUser);
router.get("/", authenticateToken, getUserDetails);

module.exports = router;