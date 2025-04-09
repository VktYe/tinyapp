const getUserByEmail = function(email, database) {
  for (const userId in database) {
    const user = database[userId];
    if (email === user.email) { // if user.email exists return user
      return user;
    }
  }
  return null;
};


const urlsForUser = function(userId, database) { // create a new obj with matching userID
  const userURLs = {};
  for (const urlID in database) {
    if (database[urlID].userID === userId) {
      userURLs[urlID] = database[urlID];
    }
  }
  return userURLs;
};

module.exports = {
  getUserByEmail,
  urlsForUser
};