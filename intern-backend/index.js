const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./src/config/config");
const routes = require("./src/routes/routes");
const saveDataRoute = require("./src/routes/saveDataToDB");

const app = express();

// Start the server
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1 style='color:green; display:flex; justify-content:center;'>Server Connection working</h1>");
});

// Database connection
mongoose
  .connect(config.mongoConnectionUrl, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch(error => {
    console.error("Error connecting to the database:", error.message);
  });

app.use(cors());
app.use(bodyParser.json());
//Created route for API to initialize the database
app.use("/save", saveDataRoute);
//All other API routes are present in this file
app.use(routes);

module.exports = app;
