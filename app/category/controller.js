const Category = require("./models");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const category = await Category.find();
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "| Kategori",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create", { title: "| Tambah Kategori" });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      let { name } = req.body;
      const category = new Category({ name });
      await category.save();
      req.flash("alertMessage", "Berhasil tambah kategori");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      let { id } = req.params;
      const category = await Category.findById(id);
      res.render("admin/category/edit", { category, title: "| Edit Kategori" });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      let { id } = req.params;
      let { name } = req.body;
      await Category.findOneAndUpdate(
        {
          _id: id,
        },
        { name }
      );

      req.flash("alertMessage", "Berhasil edit kategori");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      console.log(err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Category.findOneAndRemove({
        _id: id,
      });

      req.flash("alertMessage", "Berhasil hapus kategori");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");

      res.redirect("/category");
    }
  },
};
