const { assert } = require("chai");
const { getUserByEmail, urlsForUser } = require("../helpers.js");

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
// Test data
const testUrlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" },
  xyz123: { longURL: "http://example.com", userID: "userRandomID" },
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.deepEqual(user.id, expectedUserID, "User ID should match expected ID for valid email");
  });

  it('should return null with invalid email', function() {
    const user = getUserByEmail("user@emple.com", testUsers);
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

describe('urlsForUser', function() {
  it('should return urls that belong to the specified user', function() {
    const result = urlsForUser("userRandomID", testUrlDatabase);
    const expected = {
      b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
      xyz123: { longURL: "http://example.com", userID: "userRandomID" }
    };
    assert.deepEqual(result, expected);
  });

  it('should return an empty object if no urls belong to the user', function() {
    const result = urlsForUser("nonexistentUser", testUrlDatabase);
    assert.deepEqual(result, {});
  });

  it('should return an empty object if the urlDatabase is empty', function() {
    const result = urlsForUser("userRandomID", {});
    assert.deepEqual(result, {});
  });

  it('should not return any urls that do not belong to the specified user', function() {
    const result = urlsForUser("user2RandomID", testUrlDatabase);
    const expected = {
      "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
    };
    assert.deepEqual(result, expected);
  });
});