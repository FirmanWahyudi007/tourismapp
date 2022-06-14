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
router.get("/create", viewCreate);
router.post("/create", multipartMiddleware, actionCreate); // multipartMiddleware is for upload file
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", actionEdit);
router.delete("/delete/:id", actionDelete);
router.get("/api/", apiGetAll);

module.exports = router;
