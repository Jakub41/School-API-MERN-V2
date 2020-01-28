// API URL ENV
const { Config } = require("../config");
const BaseURL = Config.server.url;
// Express Lib
const express = require("express");
// Routes lib
const router = express.Router();

// Defining the Index Routers
router.use(BaseURL + "students", require("./students"));
router.use(BaseURL + "projects", require("./projects"));

// Exporting the Index Router
module.exports = router;
