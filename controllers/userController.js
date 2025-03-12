const {
  validateEmail, // Function to validate email format
  validateLength, // Function to validate length of fields
  validateUsername, // Function to validate or generate a username
} = require("../helpers/validation");

const { jwToken } = require("../helpers/token"); // Function to generate JWT token
const jwt = require("jsonwebtoken");
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

    const token = jwToken({ id: user._id.toString() }, "7d");

    // Send user data as response
    res.send({
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      fName: user.fName,
      lName: user.lName,
      token: token,
      verified: user.verified,
      message:
        "Registration successfully ! Please activate your email to start.",
    });
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      message: "Cannot create user.",
      error: error.message,
    });
  }
};

exports.verifiedUser = async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.SECRET_TOKEN);
    const check = await Users.findById(user.id);

    if (check.verified === true) {
      return res.status(400).json({
        message: "This email is already verified",
      });
    } else {
      await Users.findByIdAndUpdate(user.id, { verified: true });
      return res.status(200).json({
        message: "Account has been activated successfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message:
          "The email address you entered is not connected to and account",
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials. Please try again",
      });
    }

    const token = jwToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      fName: user.fName,
      lName: user.lName,
      token: token,
      verified: user.verified,
      message: "Login successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


exports.auth = async (req, res) => {
  res.send("Auth");
  console.log("this is validate user");
  
};

