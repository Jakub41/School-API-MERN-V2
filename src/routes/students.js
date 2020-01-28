// Express
const express = require("express");

// Router
const router = express.Router();

// To test if all running ok
router.get("/", async (req, res) => {
    res.send('OK endpoint!');
});

module.exports = router;
