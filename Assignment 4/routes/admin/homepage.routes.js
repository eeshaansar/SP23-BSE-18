const express = require("express");
const router = express.Router();
const productModel = require("../../models/products.model");
const categoryModel = require("../../models/categories.model");

// display the main page with all categories
router.get("/main", async (req, res) => {
  try {
    const categories = await categoryModel.find();
    console.log("Categories fetched:", categories); // Debugging
    res.render("website/homepage", { categories, layout: "layout" });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error loading categories");
  }
});

// display products by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Get the category ID from the URL
    console.log("Category ID received:", categoryId);

    // Validate if categoryId is a valid MongoDB ObjectId
    if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send("Invalid Category ID");
    }

    const category = await categoryModel.findById(categoryId);
    console.log("Category fetched:", category);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    const products = await productModel.find({ category: categoryId });
    console.log("Products fetched:", products);

    res.render("website/product", { category, products });
  } catch (err) {
    console.error("Error fetching category products:", err);
    res.status(500).send("Error fetching category products");
  }
});

//  category details with product information
router.get("/details/:categoryId/:productId", async (req, res) => {
  try {
    const { categoryId, productId } = req.params;
    console.log(
      "Category ID for details:",
      categoryId,
      "Product ID:",
      productId
    );

    // Validate if categoryId and productId are valid MongoDB ObjectIds
    if (
      !categoryId.match(/^[0-9a-fA-F]{24}$/) ||
      !productId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.status(400).send("Invalid Category or Product ID");
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("website/productDetail", {
      category,
      product,
      layout: "layout",
    });
  } catch (err) {
    console.error("Error fetching product details:", err);
    res.status(500).send("Error fetching product details");
  }
});

module.exports = router;
