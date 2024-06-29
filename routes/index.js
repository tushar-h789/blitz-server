const express = require("express");
const router = express.Router();
const api = require("./api");

// Get the base API URL from environment variables
const baseAPI = process.env.BASE_API_URL;

router.use(baseAPI, api); // Mount the API router on the base API URL

module.exports = router; 
