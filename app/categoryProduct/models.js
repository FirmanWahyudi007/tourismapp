const mongoose = require("mongoose");
let categoryProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama Kategori harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryProduct", categoryProductSchema);
