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
const { isLoginAdmin } = require("../middleware/auth");

router.get("/", isLoginAdmin, index);
router.get("/create", isLoginAdmin, viewCreate);
router.post("/create", isLoginAdmin, multipartMiddleware, actionCreate);
router.get("/edit/:id", isLoginAdmin, viewEdit);
router.put("/edit/:id", isLoginAdmin, actionEdit);
router.delete("/delete/:id", isLoginAdmin, actionDelete);
router.get("/api/", apiGetAll);

module.exports = router;
