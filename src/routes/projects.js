// Express
const express = require("express");

// controller
const { ProjectCtrl } = require("../controllers");

// Middleware CommonReq => common requests to get by id or username
// Allows to not write again same requests for common GET :params
const { CommonReq } = require("../middleware");

// Router
const router = express.Router();

// Student CRUD routes
router.get("/:username", CommonReq.getByUserName, ProjectCtrl.getAll);
router.get("/:username/project/:projectId", CommonReq.getByUserName, ProjectCtrl.getById);
router.post("/:username", CommonReq.getByUserName, ProjectCtrl.createNew);
router.patch("/:username/project/:projectId", CommonReq.getByUserName, ProjectCtrl.update);
router.delete("/:username/project/:projectId", CommonReq.getByUserName, ProjectCtrl.delete);

module.exports = router;
