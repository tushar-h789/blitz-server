const express = require("express");
const router = express.Router();
const auth = require("./auth.js");

router.use("/auth", auth); // Mount the auth router on the "/auth" path

module.exports = router; // Export the configured router
