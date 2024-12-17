const express = require("express");
const router = express.Router();
const productModel = require("../../models/products.model");
const categoryModel = require("../../models/categories.model");
const multer = require("multer");

// Multer Configuration for File Uploads
const upload = multer({ dest: "./public/uploads" });

// Route: Display "Add Product" Form
router.get("/add", async (req, res) => {
    try {
        const categories = await categoryModel.find(); // Fetch all categories
        res.render("products/addproducts", { categories }); // Pass categories to the view
    } catch (err) {
        console.error("Error loading categories:", err);
        res.status(500).send("Failed to load categories.");
    }
});

// Route: Display All Products
router.get("/read", async (req, res) => {
    try {
        const products = await productModel.find().populate("category");
        res.render("products/readproduct", { products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Error loading products.");
    }
});

// Route: Add a New Product
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        const { name, color, size, description, price, category } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : "";

        // Validate required fields
        if (!name || !color || !size || !description || !price || !category) {
            const categories = await categoryModel.find();
            return res.render("products/addproducts", {
                errorMessage: "All fields are required!",
                categories,
            });
        }

        // Create the product
        await productModel.create({
            name,
            color: color.split(",").map((c) => c.trim()), // Convert comma-separated string to array
            size: size.split(",").map((s) => s.trim()),   // Convert comma-separated string to array
            description,
            price,
            image,
            category,
        });

        res.redirect("/admin/products/read");
    } catch (err) {
        console.error("Error creating product:", err);
        const categories = await categoryModel.find();
        res.render("products/addproducts", {
            errorMessage: "Failed to add product. Please try again!",
            categories,
        });
    }
});

// Route: Delete a Product
router.get("/delete/:id", async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.redirect("/admin/products/read");
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).send("Error deleting product.");
    }
});

// Route: Display "Edit Product" Form
router.get("/edit/:id", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        const categories = await categoryModel.find();

        if (!product) {
            return res.redirect("/admin/products/read");
        }

        res.render("products/editproduct", { product, categories });
    } catch (err) {
        console.error("Error fetching product for editing:", err);
        res.status(500).send("Error loading product for editing.");
    }
});

// Route: Update a Product
router.post("/update/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, color, size, description, price, category } = req.body;
        let image = req.file ? `/uploads/${req.file.filename}` : req.body.existingImage;

        // Validate required fields
        if (!name || !color || !size || !description || !price || !category) {
            const product = await productModel.findById(req.params.id);
            const categories = await categoryModel.find();
            return res.render("products/editproduct", {
                errorMessage: "All fields are required!",
                product,
                categories,
            });
        }

        // Update the product
        await productModel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                color: color.split(",").map((c) => c.trim()), // Convert comma-separated string to array
                size: size.split(",").map((s) => s.trim()),   // Convert comma-separated string to array
                description,
                price,
                image,
                category,
            },
            { new: true } // Return the updated document
        );

        res.redirect("/admin/products/read");
    } catch (err) {
        console.error("Error updating product:", err);
        const product = await productModel.findById(req.params.id);
        const categories = await categoryModel.find();
        res.render("products/editproduct", {
            errorMessage: "Failed to update product. Please try again!",
            product,
            categories,
        });
    }
});

// Route: Display Home Page
router.get("/home", (req, res) => {
    res.render("website/main", { layout: "layout" });
});

module.exports = router;
