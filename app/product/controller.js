const Product = require("./models");
const Category = require("../categoryProduct/models");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
module.exports = {
  index: async (req, res) => {
    try {
      const products = await Product.find().populate("category");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/product/view_product", {
        title: "| Produk",
        name: req.session.user.nama,
        products,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      console.log(error);
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      res.render("admin/product/create", {
        category,
        title: "| Tambah Produk",
        name: req.session.user.nama,
      });
    } catch (error) {
      console.log(error);
    }
  },
  actionCreate: async (req, res) => {
    try {
      let { name, description, price, category } = req.body;
      price = strRP(price);
      if (req.files) {
        var files = [];
        var fileKeys = Object.keys(req.files.galleries);
        fileKeys.forEach(function (key) {
          files.push(req.files.galleries[key].name);
          let tmp_path = req.files.galleries[key].path;
          let fileName = req.files.galleries[key].name;
          let target_path = path.resolve(
            config.rootPath,
            `public/images/products/${fileName}`
          );
          const src = fs.createReadStream(tmp_path);
          const dest = fs.createWriteStream(target_path);

          src.pipe(dest);
          src.on("end", async () => {
            fs.unlink(tmp_path, (err) => {
              if (err) throw err;
            });
          });
        });
        await Product.create({
          name,
          description,
          price,
          category,
          galleries: files,
        });
        req.flash("alertMessage", "Berhasil tambah produk");
        req.flash("alertStatus", "success");
        res.redirect("/product");
      } else {
        res.redirect("/product/create");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      const category = await Category.find();
      res.render("admin/product/edit", {
        category,
        title: "| Edit Produk",
        name: req.session.user.nama,
        product,
      });
    } catch (error) {
      console.log(error);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      let { name, description, price, category } = req.body;
      console.log(req.body);
      price = strRP(price);
      await Product.findByIdAndUpdate(id, {
        name,
        description,
        price,
        category,
      });
      req.flash("alertMessage", "Berhasil edit produk");
      req.flash("alertStatus", "success");
      res.redirect("/product");
    } catch (error) {
      console.log(error);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (product.galleries) {
        product.galleries.forEach(async (file) => {
          const filePath = path.resolve(
            config.rootPath,
            `public/images/products/${file}`
          );
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        });
      }
      await Product.findByIdAndDelete(id);
      req.flash("alertMessage", "Berhasil hapus produk");
      req.flash("alertStatus", "success");
      res.redirect("/product");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
};

function strRP(price) {
  var baru = price.replace("Rp. ", "");
  var replacePoint = baru.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
  var newPrice = Number(replacePoint);
  return newPrice;
}
