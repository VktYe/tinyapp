const { assert } = require("chai");
const { getUserByEmail } = require("../helpers.js");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.deepEqual(user.id, expectedUserID)
  });

  it('should return null with invalid email', function() {
    const user = getUserByEmail("user@emple.com", testUsers)
    assert.equal(user, null);
  });

  it('should return null if users argument is null', function() {
    const user = getUserByEmail("user@example.com", null);
    assert.equal(user, null);
  });

  it('should return null with an empty users object', function() {
    const user = getUserByEmail("user@example.com", {});
    assert.equal(user, null);
  });

});