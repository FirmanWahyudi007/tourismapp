var express = require("express");
var router = express.Router();
const {
  viewSignin,
  actionSignin,
  actionLogout,
  actionSignup,
} = require("./controller");

router.get("/", viewSignin);
router.post("/", actionSignin);
router.get("/logout", actionLogout);
router.get("/tes", actionSignup);

module.exports = router;
