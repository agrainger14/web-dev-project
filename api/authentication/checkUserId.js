const { getUserByMoodlogId } = require("../mood/service");

async function checkUser(req, res, next) {
    const moodlog_id = req.params.moodlog_id;
    const token_user_id = req.results.user_id;

    try {
        const [result, fields] = await getUserByMoodlogId(moodlog_id);

        if (!result[0]) {
            return res.status(400).json({
                message: "Moodlog entry does not exist!"
            });
        }
    
        if (token_user_id != result[0].user_id) {
            return res.status(400).json({
                message: "Invalid user ID!"
            });
        } else {
            req.moodlog_id = moodlog_id;
            next();
        }

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
}

module.exports = { checkUser };