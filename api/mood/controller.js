const {
    readByUserId,
    updateMoodLog,
    deleteMoodLog,
    createMoodLog,
} = require("./service");
  
async function addMoodlog(req, res) {
  try {
    const user_id = req.results.user_id;
    const body = req.body;

    if (!req.body.mood) {
      req.body.mood = null;
    }

    const [rows, fields] = await createMoodLog(user_id, body);

    if (!rows.affectedRows) {
      throw new Error("Error adding mood log!");
    }

    return res.status(201).json({
      message: "Mood log successfully added!",
    });
  
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

async function getMoodlogsByUserId(req, res) {
  try {
    const user_id = req.results.user_id;
  
    const [rows, fields] = await readByUserId(user_id);

    if (!rows.length) {
      return res.status(200).json({
        message: "No moodlogs by that user id!"
      });
    }

    return res.status(200).json({
      data: rows
    });

  } catch (err) {
    return res.status(404).json({
      message: err.message
    });
  }
};

async function editMoodlogContext(req, res) {
  try {
    const moodlog_id = req.moodlog_id;
    const body = req.body

    if (!body.context) {
      throw new Error("No context received!");
    }

    const [rows, fields] = await updateMoodLog(moodlog_id, body);

    if (!rows.affectedRows) {
      return res.status(400).json({
        message: "Moodlog id does not exist!"
      });
    }

    return res.status(200).json({
      message: `Mood entry with id ${moodlog_id} successfully updated.`
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

async function deleteMoodlogEntry(req, res) {
  try {
    const moodlog_id = req.moodlog_id;

    const [result, fields] = await deleteMoodLog(moodlog_id);

    if (!result.affectedRows) {
      return res.status(400).json({
        message: "Moodlog entry not found!"
      });
    }

    return res.status(200).json({
      message: `Moodlog with id ${moodlog_id} successfully deleted.`
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};
    
module.exports = {addMoodlog, getMoodlogsByUserId, editMoodlogContext, deleteMoodlogEntry};