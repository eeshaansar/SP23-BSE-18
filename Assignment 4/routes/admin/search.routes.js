const express = require("express");
const Product = require("../../models/products.model"); // Assuming Product model exists
const router = express.Router();
const category = require("../../models/categories.model");

// Search 
router.get("/find", async (req, res) => {
  const query = req.query.query;
  try {
    if (!query) {
      return res.redirect("/search/find"); 
    }

    const products = await Product.find({
      $or: [{ name: { $regex: query, $options: "i" } }],
    });

    if (products.length === 0) {
      return res.render("website/no-results", { query }); 
    }

    res.render("website/search-results", { products, query });
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).send("Server error while searching for products.");
  }
});

module.exports = router;
