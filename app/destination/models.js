const mongoose = require("mongoose");

let destinationSchema = mongoose.Schema(
  {
    name: {
      require: [true, "Nama destinasi harus diisi"],
      type: String,
    },
    description: {
      require: [true, "Deskripsi destinasi harus diisi"],
      type: String,
    },
    address: {
      require: [true, "Alamat destinasi harus diisi"],
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    google_map: {
      type: String,
      default: "",
    },
    galleries: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
