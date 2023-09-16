const dbpool = require("../config/dbpool");

async function readByUserId(user_id) {
  try {
    const query = `SELECT moodlog.moodlog_id, DATE_FORMAT(moodlog.datetime, '%d/%b/%Y %H:%i:%s') AS datetime, mood.mood, moodlog.rating, moodlog.context 
                  FROM moodlog
                  INNER JOIN user_mood
                  ON moodlog.user_mood_id = user_mood.user_mood_id
                  INNER JOIN mood
                  ON user_mood.mood_id = mood.mood_id
                  WHERE user_mood.user_id = ?
                  ORDER BY datetime ASC` ;
    const value = [user_id];

    const result = await dbpool.execute(query, value);

    return result;
  } catch (error) {
    throw error;
  }
};

async function getUserByMoodlogId(moodlog_id) {
  try {
    const query = `SELECT user_mood.user_id FROM moodlog INNER JOIN user_mood ON
                  moodlog.user_mood_id = user_mood.user_mood_id
                  where moodlog_id = ?`;
    const value = [moodlog_id];

    const result = await dbpool.execute(query, value);

    return result;
  } catch (error) {
    throw error;
  }
};

async function createMoodLog(user_id, data) {
  const connection = await dbpool.getConnection();
  
  try {
    await connection.beginTransaction()

    const addMoodQuery = 'INSERT IGNORE INTO mood (mood) VALUES (?)';
    const addUserMoodQuery = 'INSERT IGNORE INTO user_mood (user_id, mood_id) VALUES (?, (SELECT mood_id FROM mood WHERE mood = ?))';
    const addMoodlogQuery = `INSERT INTO moodlog (user_mood_id, context, rating) VALUES 
                            ((SELECT user_mood_id FROM user_mood WHERE user_id = ? AND 
                            mood_id = (SELECT mood_id FROM mood WHERE mood = ?)), ?, ?)`;
    
    await connection.execute(addMoodQuery, [data.mood]);
    await connection.execute(addUserMoodQuery, [user_id, data.mood]);
    const result = await connection.execute(addMoodlogQuery, [user_id, data.mood, data.context, data.rating]);
    await connection.commit();
    
    return result;            
  } catch (error) {
    await connection.rollback()
    throw error;
  } finally {
    connection.release();
  }
};

async function updateMoodLog(moodlog_id, data){
  try {
    const query = 'UPDATE moodlog SET context = ? WHERE moodlog_id = ?';
    const values = [data.context, moodlog_id];

    const result = await dbpool.execute(query, values);

    return result;
  } catch (error) {
    throw error;
  }
};

async function deleteMoodLog(moodlog_id) {
  try {
    const query = 'DELETE moodlog FROM moodlog WHERE moodlog_id = ?'; 
    const value = [moodlog_id];

    const result = dbpool.execute(query, value);

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { createMoodLog, readByUserId, updateMoodLog, deleteMoodLog, getUserByMoodlogId }

