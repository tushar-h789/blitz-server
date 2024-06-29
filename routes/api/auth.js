const express = require("express");
const router = express.Router();
const { newUser } = require("../../controllers/userController");

router.post("/", newUser); // Handle POST requests to the root path

module.exports = router;
