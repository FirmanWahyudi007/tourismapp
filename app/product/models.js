const mongoose = require("mongoose");
let productSchema = mongoose.Schema({
  name: {
    require: [true, "Nama produk harus diisi"],
    type: String,
  },
  description: {
    require: [true, "Deskripsi produk harus diisi"],
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  galleries: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
