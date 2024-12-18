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

// Route to display products by category
router.get('/category/:categoryId', async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 4; 
  const skip = (page - 1) * limit;
  
  // Get filter parameters from the query
  const { query, minPrice, maxPrice } = req.query;

  const filter = { category: req.params.categoryId };

  if (query) {
    filter.name = { $regex: query, $options: 'i' };
  }

  if (minPrice) {
    filter.price = { $gte: parseFloat(minPrice) };
  }

  if (maxPrice) {
    filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
  }

  try {
    const categoryId = req.params.categoryId;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    const products = await productModel.find(filter)
      .skip(skip)
      .limit(limit);

    const totalProducts = await productModel.countDocuments(filter); 
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('website/product', {
      category,
      products,
      totalPages,
      currentPage: page,
      limit,
      query,
      minPrice,
      maxPrice
    });
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
