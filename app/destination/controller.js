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
      let {
        name,
        description,
        address,
        low_price,
        high_price,
        category,
        google_map,
      } = req.body;
      console.log(req.body);
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
          `public/images/destinations/${fileName}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);

        src.on("end", async () => {
          try {
            await fs.unlinkSync(tmp_path);
            const destination = new Destination({
              name,
              description,
              address,
              price,
              category,
              google_map,
              galleries: fileName,
            });
            await destination.save();
            req.flash("alertStatus", "success");
            req.flash("alertMessage", `Berhasil menambahkan destination`);
            res.redirect(`/destination`);
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/destination");
          }
        });
      } else {
        req.flash("alertMessage", "Gambar tidak boleh kosong");
        req.flash("alertStatus", "danger");
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
      console.log(req.file);
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let fileName = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/images/destinations/${fileName}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);

        src.on("end", async () => {
          try {
            await fs.unlinkSync(tmp_path);
            const destination = await Destination.findById(id);
            let currentImg = `${config.rootPath}/public/images/destinations/${destination.galleries}`;
            if (fs.existsSync(currentImg)) {
              fs.unlinkSync(currentImg);
            }
            destination.name = name;
            destination.description = description;
            destination.address = address;
            destination.price = price;
            destination.category = category;
            destination.google_map = google_map;
            destination.galleries = fileName;
            await destination.save();
            req.flash("alertStatus", "success");
            req.flash("alertMessage", `Berhasil mengubah destination`);
            res.redirect(`/destination`);
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/destination");
          }
        });
      } else {
        const destination = await Destination.findById(id);
        destination.name = name;
        destination.description = description;
        destination.address = address;
        destination.price = price;
        destination.category = category;
        destination.google_map = google_map;
        await destination.save();
        req.flash("alertStatus", "success");
        req.flash("alertMessage", `Berhasil mengubah destination`);
        res.redirect(`/destination`);
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const destination = await Destination.findById(id);
      let currentImg = `${config.rootPath}/public/images/destinations/${destination.galleries}`;
      if (fs.existsSync(currentImg)) {
        fs.unlinkSync(currentImg);
      }
      await Destination.findByIdAndRemove({ _id: id });
      req.flash("alertMessage", "Berhasil hapus destinasi");
      req.flash("alertStatus", "success");
      res.redirect("/destination");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
      res.redirect("/destination");
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
