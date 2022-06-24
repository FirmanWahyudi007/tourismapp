const Destination = require("./models");
const Category = require("../category/models");

const path = require("path");
const fs = require("fs");
const config = require("../../config");
const { name } = require("ejs");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      console.log(req.session.user);
      const alert = { message: alertMessage, status: alertStatus };
      const destination = await Destination.find().populate("category");
      res.render("admin/destination/view_destination", {
        destination,
        alert,
        name: req.session.user.nama,
        title: "| Destinasi Wisata",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      res.render("admin/destination/create", {
        category,
        title: "| Tambah Destination",
        name: req.session.user.nama,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      let { name, description, address, price, category, google_map } =
        req.body;
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
            `public/images/destinations/${fileName}`
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
        await Destination.create({
          name,
          description,
          address,
          price,
          category,
          google_map,
          galleries: files,
        });
        req.flash("alertMessage", "Berhasil tambah destinasi");
        req.flash("alertStatus", "success");
        res.redirect("/destination");
      } else {
        res.redirect("/destination/create");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const destination = await Destination.findById(id);
      const category = await Category.find();
      res.render("admin/destination/edit", {
        destination,
        category,
        title: "| Edit Destination",
        name: req.session.user.nama,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      let { name, description, address, price, category, google_map } =
        req.body;
      price = strRP(price);
      await Destination.findByIdAndUpdate(id, {
        name,
        description,
        address,
        price,
        category,
        google_map,
      });
      req.flash("alertMessage", "Berhasil edit destinasi");
      req.flash("alertStatus", "success");
      res.redirect("/destination");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const destination = await Destination.findById(id);
      if (destination) {
        destination.galleries.forEach(async (image) => {
          fs.unlink(
            path.resolve(
              config.rootPath,
              `public/images/destinations/${image}`
            ),
            (err) => {
              if (err) throw err;
            }
          );
        });
        await Destination.findByIdAndDelete(id);
        req.flash("alertMessage", "Berhasil hapus destinasi");
        req.flash("alertStatus", "success");
        res.redirect("/destination");
      } else {
        req.flash("alertMessage", "Destinasi tidak ditemukan");
        req.flash("alertStatus", "danger");
        res.redirect("/destination");
      }
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
