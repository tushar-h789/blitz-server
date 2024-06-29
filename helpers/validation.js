const Users = require("../models/userModel");

exports.validateEmail = (email) => {
  return String(email)
    .toLocaleLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.validateLength = (text, min, max) => {
  if (text.length < min || text.length > max) {
    return false;
  } else {
    return true;
  }
};

exports.validateUsername = async (username) => {
  let isTrue = false; // Flag to indicate if a duplicate username is found.

  do {
    // Check if the username already exists in the database.
    let user = await Users.findOne({ username });
    if (user) {
      // Append a random digit to the username if a duplicate is found.
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      isTrue = true; // Continue the loop to check the new username.
    } else {
      isTrue = false; // Exit the loop if the username is unique.
    }
  } while (isTrue);

  return username; // Return the unique username.
};