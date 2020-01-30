// Express
const express = require("express");

// controller
const { SearchCtrl } = require("../controllers");

// Router
const router = express.Router();

// Student CRUD routes
router.get("/", SearchCtrl.getStudentBy);

module.exports = router;
