const express = require("express");
const router = express.Router();
const categoryModel = require("../../models/categories.model");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads" });

//add
router.get("/add", (req, res) => {
  res.render("categories/addcategory", { layout: "layout" });
});

//read
router.get("/read", async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.render("categories/readcategory", { categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error loading categories");
  }
});

//add
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    if (!name) {
      return res.render("categories/addcategory", {
        errorMessage: "Category name is required!",
      });
    }

    await categoryModel.create({ name, image });

    res.redirect("/admin/categories/read"); 
  } catch (err) {
    console.error("Error creating category:", err);
    res.render("categories/addcategory", {
      errorMessage: "Failed to add category. Please try again!",
    });
  }
});

//delete
router.get("/delete/:id", async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/categories/read");
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).send("Error deleting category");
  }
});

// edit
router.get("/edit/:id", async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.redirect("/admin/categories/read");
    }
    res.render("categories/editcategory", { category });
  } catch (err) {
    console.error("Error fetching category for edit:", err);
    res.status(500).send("Error loading category for editing");
  }
});

// update
router.post("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found.");
    }

  
    category.name = name || category.name;

    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }

    // Save the updated category
    await category.save();

    res.redirect("/admin/categories/read");
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).send("Failed to update category.");
  }
});

module.exports = router;
