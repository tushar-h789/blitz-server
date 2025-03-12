const express = require("express");
const router = express.Router();
const { newUser, verifiedUser, login, auth} = require("../../controllers/userController");

router.post("/", newUser); // Handle POST requests to the root path
router.post("/activate", verifiedUser); // Handle POST requests to the root path
router.post("/login", login); // Handle POST requests to the root path
router.post("/auth", auth); // Handle POST requests to the root path

module.exports = router;
