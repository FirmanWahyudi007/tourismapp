module.exports = {
  index: async (req, res) => {
    try {
      res.render("admin/product/view_product", { title: "| Produk" });
    } catch (error) {
      console.log(error);
    }
  },
};
