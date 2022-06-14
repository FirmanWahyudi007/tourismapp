var express = require("express");
var router = express.Router();
const { apiDestination, apiProduct } = require("./controller");

router.get("/destination", apiDestination);
router.get("/product", apiProduct);

module.exports = router;
