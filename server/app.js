// modules
require("dotenv").config();
const express = require("express");

// init
const app = express();
const port = process.env.PORT || 5000;

// check api running or not
app.get("/", (req, res) => {
  res.send("Notez is running...");
});

app.listen(port, (_) => {
  console.log(`Notez API is running on port: ${port}`);
});
