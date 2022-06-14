const User = require("./models");
const bycrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_signin", { alert });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const check = await User.findOne({ email: email });
      if (!check) {
        req.flash("alertMessage", "Email tidak ada");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      } else {
        const checkPassword = await bycrypt.compare(password, check.password);
        if (!checkPassword) {
          req.flash("alertMessage", "Password salah");
          req.flash("alertStatus", "danger");
          res.redirect("/");
        } else {
          req.session.user = {
            id: check._id,
            email: check.email,
            nama: check.nama,
          };
          res.redirect("/dashboard");
        }
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionLogout: async (req, res) => {
    try {
      req.flash("alertMessage", "Berhasil logout");
      req.flash("alertStatus", "success");
      req.session.destroy();
      res.redirect("/");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionSignup: async (req, res) => {
    try {
      const data = {
        email: "admin@gmail.com",
        password:
          "$2a$10$2ATMEfhS1nt5c3VXgzlaqe3epJFTuY7.oKpORdOgqtxFNYLcndCFW",
        nama: "Admin",
      };
      const result = await User.create(data);
      res.redirect("/");
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  },
};
