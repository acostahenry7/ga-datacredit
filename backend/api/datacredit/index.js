const express = require("express");
const router = express.Router();
const { get } = require("./controller");

router.get("/test-db", get);

module.exports = router;
