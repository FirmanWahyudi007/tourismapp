var express = require("express");
var router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
  apiGetAll,
} = require("./controller");

router.get("/", index);

module.exports = router;
