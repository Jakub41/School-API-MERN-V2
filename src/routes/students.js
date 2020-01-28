// Express
const express = require("express");

// controller
const { StudentsCtrl } = require("../controllers");

// Middleware CommonReq => common requests to get by id or username
// Allows to not write again same requests for common GET :params
const { CommonReq } = require("../middleware");

// Router
const router = express.Router();

// Student CRUD routes
router.get("/", StudentsCtrl.getAll);
router.get("/:id", CommonReq.getById, StudentsCtrl.getById);
router.post("/", StudentsCtrl.createNew);
router.patch("/:id", CommonReq.getById, StudentsCtrl.update);
router.delete("/:id", CommonReq.getById, StudentsCtrl.delete);

module.exports = router;
