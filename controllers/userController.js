const {
  validateEmail, // Function to validate email format
  validateLength, // Function to validate length of fields
  validateUsername, // Function to validate or generate a username
} = require("../helpers/validation");

const { jwToken } = require("../helpers/token"); // Function to generate JWT token
const Users = require("../models/userModel"); // User model
const bcrypt = require("bcrypt"); // Library for hashing passwords
const { sendVerifiedEmail } = require("../helpers/mailer"); // Function to send email

exports.newUser = async (req, res) => {
  try {
    const { fName, lName, username, email, password, bMonth, bDay, bYear } =
      req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid Email Address" });
    }

    // Check if email already exists in the database
    const checkMail = await Users.findOne({ email });
    if (checkMail) {
      return res.status(400).json({ message: "Email already Exists" });
    }

    // Validate first name length
    if (!validateLength(fName, 3, 15)) {
      return res.status(400).json({
        message: "First Name should be minimum 3 and maximum 15 characters",
      });
    }

    // Validate last name length
    if (!validateLength(lName, 3, 15)) {
      return res.status(400).json({
        message: "Last Name should be minimum 3 and maximum 15 characters",
      });
    }

    // Validate password length
    if (!validateLength(password, 8, 40)) {
      return res.status(400).json({
        message: "Password should be minimum 8 characters.",
      });
    }

    // Hash the password using bcrypt
    const crypted = await bcrypt.hash(password, 10);

    // Generate a valid username
    let tempUsername = fName + lName;
    let finalUsername = await validateUsername(tempUsername);

    // Create and save new user
    const user = await new Users({
      fName,
      lName,
      username: finalUsername,
      email,
      password: crypted, // Save hashed password
      bMonth,
      bDay,
      bYear,
    }).save();

    // Generate email verification token
    const emailToken = jwToken({ id: user._id.toString() }, "30m");
    const url = `${process.env.BASE_URL}/activate/${emailToken}`;

    // Send verification email
    sendVerifiedEmail(user.email, user.fName, url);

    // Send user data as response
    res.send(user);
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      message: "Cannot create user.",
      error: error.message,
    });
  }
};
