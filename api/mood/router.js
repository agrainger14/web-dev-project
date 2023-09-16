const router = require("express").Router();

const { authenticateToken } = require("../authentication/checkJwt");
const { checkUser } = require("../authentication/checkUserId");

const {
   addMoodlog,
   getMoodlogsByUserId,
   editMoodlogContext,
   deleteMoodlogEntry
} = require("./controller");

router.get("/", authenticateToken, getMoodlogsByUserId);
router.post("/", authenticateToken, addMoodlog);
router.put("/:moodlog_id", authenticateToken, checkUser, editMoodlogContext);
router.delete("/:moodlog_id", authenticateToken, checkUser, deleteMoodlogEntry);

module.exports = router;