const dbpool = require("../config/dbpool");

async function createUser(data) {
  try {
    const query = 'INSERT INTO user(first_name, username, password) values( ? , ? , ? )';
    const values = [data.first_name, data.username, data.password];

    const result = await dbpool.execute(query, values);
    return result;

  } catch (error) {
    throw error;
  }
};

async function readUserByUsername(username) {
  try {
    const query = 'SELECT * from user WHERE username = ?';
    const value = [username];
    
    const result = await dbpool.execute(query, value);
    return result;
  } catch (error) {
    throw error;
  }
};

async function readUserDetails(user_id) {
  try {
    const query = 'SELECT user_id, first_name, username FROM user WHERE user_id = ?';
    const value = [user_id];

    const result = await dbpool.execute(query, value)
    return result;
  } catch (error) {
    throw error;
  }
};

async function deleteUserDetails(userId) {
  const connection = await dbpool.getConnection();

  try {
    await connection.beginTransaction()

    const deleteMoodlogQuery = 'DELETE moodlog FROM moodlog INNER JOIN user_mood ON moodlog.user_mood_id = user_mood.user_mood_id WHERE user_mood.user_id = ?';
    const deleteUserMoodQuery = 'DELETE user_mood FROM user_mood WHERE user_id = ?';
    const deleteUserQuery = 'DELETE user FROM user WHERE user_id = ?';
    const value = [userId];
      
    await connection.execute(deleteMoodlogQuery, value);
    await connection.execute(deleteUserMoodQuery, value);
    const result = await connection.execute(deleteUserQuery, value);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback()
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { createUser, readUserByUsername, readUserDetails, deleteUserDetails }