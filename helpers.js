const getUserByEmail = function(email, database) {
  for (const userId in database) {
    const user = database[userId];
    if (email === user.email) { // if user.email exists return user
      return user;
    }
  }
  return null;
};


module.exports = {
  getUserByEmail,
};