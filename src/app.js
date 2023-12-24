const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/routes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware for ticket-related routes
app.use("/api", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
