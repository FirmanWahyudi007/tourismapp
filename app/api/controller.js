const Destination = require("../destination/models");
const Product = require("../product/models");
module.exports = {
  apiDestination: async (req, res) => {
    try {
      let { category, name, minPrice, maxPrice } = req.query;
      // const category = await Category.find();
      if (category) {
        const destination = await Destination.find().populate({
          path: "category",
          select: "name",
          match: { name: category },
        });
        var data = [];
        for (let i = 0; i < destination.length; i++) {
          if (destination[i].category != null) {
            data.push({
              destination: destination[i],
            });
          }
        }
        if (data.length > 0) {
          res.json({
            status: "success",
            data,
          });
        } else {
          res.json({
            status: "failed",
            message: "Data tidak ditemukan",
          });
        }
      } else if (name) {
        const destination = await Destination.find({
          name: { $regex: ".*" + name + ".*" },
        }).populate("category");
        if (destination.length > 0) {
          res.json({
            status: "success",
            data: destination,
          });
        } else {
          res.json({
            status: "failed",
            message: "Data tidak ditemukan",
          });
        }
      } else if (minPrice && maxPrice) {
        const destination = await Destination.find({
          price: { $gte: minPrice, $lte: maxPrice },
        }).populate("category");
        if (destination.length > 0) {
          res.json({
            status: "success",
            data: destination,
          });
        } else {
          res.json({
            status: "failed",
            message: "Data tidak ditemukan",
          });
        }
      } else {
        const destination = await Destination.find().populate("category");
        res.json({
          data: destination,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  apiProduct: async (req, res) => {
    try {
      let { name, minPrice, maxPrice } = req.query;
      if (name) {
        const product = await Product.find({
          name: { $regex: ".*" + name + ".*" },
        });
        if (product.length > 0) {
          res.json({
            status: "success",
            data: product,
          });
        } else {
          res.json({
            status: "failed",
            message: "Data tidak ditemukan",
          });
        }
      } else if (minPrice && maxPrice) {
        const product = await Product.find({
          price: { $gte: minPrice, $lte: maxPrice },
        });
        if (product.length > 0) {
          res.json({
            status: "success",
            data: product,
          });
        } else {
          res.json({
            status: "failed",
            message: "Data tidak ditemukan",
          });
        }
      } else {
        const product = await Product.find();
        res.json({
          data: product,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
