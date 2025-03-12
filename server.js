const dotenv = require("dotenv");
dotenv.config();

const { connect } = require("./database/dbConfig");
const port = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const app = express();

// database connect part
connect();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`This server is running by port ${port}`);
});
