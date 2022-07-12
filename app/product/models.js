const mongoose = require("mongoose");
let productSchema = mongoose.Schema(
  {
    name: {
      require: [true, "Nama produk harus diisi"],
      type: String,
    },
    description: {
      require: [true, "Deskripsi produk harus diisi"],
      type: String,
    },
    price: {
      require: [true, "Harga destinasi harus diisi"],
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryProduct",
    },
    galleries: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
