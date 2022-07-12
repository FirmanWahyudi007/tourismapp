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
      let { name, description, low_price, high_price, category } = req.body;
      low_price = convertToRupiah(low_price);
      high_price = convertToRupiah(high_price);
      let price = `${low_price} - ${high_price}`;
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let fileName = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/images/products/${fileName}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            fs.unlinkSync(tmp_path);
            const product = new Product({
              name,
              description,
              price,
              galleries: fileName,
              category,
            });
            await product.save();
            req.flash("alertMessage", `${name} berhasil ditambahkan`);
            req.flash("alertStatus", "success");
            res.redirect("/product");
          } catch (error) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/destination");
          }
        });
      } else {
        req.flash("alertMessage", `Tambah produk gagal`);
        req.flash("alertStatus", "danger");
        res.redirect("/product");
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
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let fileName = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/images/products/${fileName}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            fs.unlinkSync(tmp_path);
            const product = await Product.findById(id);
            let currentImg = `${config.rootPath}/public/images/products/${product.galleries}`;
            if (fs.existsSync(currentImg)) {
              fs.unlinkSync(currentImg);
            }
            product.name = name;
            product.description = description;
            product.price = price;
            product.galleries = fileName;
            product.category = category;
            await product.save();
            req.flash("alertMessage", `${name} berhasil diubah`);
            req.flash("alertStatus", "success");
            res.redirect("/product");
          } catch (error) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/product");
          }
        });
      } else {
        const product = await Product.findById(id);
        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;
        await product.save();
        req.flash("alertMessage", `${name} berhasil diubah`);
        req.flash("alertStatus", "success");
        res.redirect("/product");
      }
    } catch (error) {
      console.log(error);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      let currentImg = `${config.rootPath}/public/images/products/${product.galleries}`;
      if (fs.existsSync(currentImg)) {
        fs.unlinkSync(currentImg);
      }
      await Product.findByIdAndRemove({ _id: id });
      req.flash("alertMessage", "Berhasil hapus product");
      req.flash("alertStatus", "success");
      res.redirect("/product");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
};

function convertToRupiah(number) {
  if (number) {
    var rupiah = "";
    var numberrev = number.toString().split("").reverse().join("");
    for (var i = 0; i < numberrev.length; i++)
      if (i % 3 == 0) rupiah += numberrev.substr(i, 3) + ".";

    return (
      "Rp. " +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
  } else {
    return number;
  }
}
