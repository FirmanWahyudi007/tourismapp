const Product = require("./models");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
module.exports = {
  index: async (req, res) => {
    try {
      const products = await Product.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/product/view_product", {
        title: "| Produk",
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
      res.render("admin/product/create", {
        title: "| Tambah Produk",
      });
    } catch (error) {
      console.log(error);
    }
  },
  actionCreate: async (req, res) => {
    try {
      let { name, description, price } = req.body;
      price = strRP(price);
      if (req.files) {
        var files = [];
        var fileKeys = Object.keys(req.files.galleries);
        // console.log(req.files.galleries[1].path);
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
  apiGetAll: async (req, res) => {
    try {
      const product = await Product.find();
      res.json(product);
    } catch (err) {
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
