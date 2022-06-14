var express = require("express");
var router = express.Router();
const { viewDashboard } = require("./controller");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", viewDashboard);

module.exports = router;
