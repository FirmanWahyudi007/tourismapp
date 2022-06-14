const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "email harus diisi"],
    },
    nama: {
      type: String,
      require: [true, "nama harus diisi"],
    },
    password: {
      type: String,
      require: [true, "password harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
