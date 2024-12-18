const express = require("express");
const router = express.Router();
const Product = require("../../models/products.model");
const authMiddleware  = require("../../middleware/authMiddleware");

// View cart
router.get('/view', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
});

// Add to cart
router.post('/details/:categoryId/product/add-to-cart/:productId', async (req, res) => {
    try {
        const { productId, categoryId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            req.flash('error', 'Product not found.');
            return res.render("website/no-results");
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Find existing item in the cart
        const existingItem = req.session.cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1; 
        } else {
            req.session.cart.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        req.flash('success', 'Product added to cart successfully!');
        res.redirect('/addtocart/view'); 
    } catch (err) {
        console.error('Error adding product to cart:', err);
        req.flash('error', 'An error occurred while adding the product to the cart.');
        res.redirect(`/user/home/category/${req.params.categoryId}`);
    }
});

// Update product quantity in cart
router.post('/update-cart/:productId', (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Finding the product in the session cart
    const item = req.session.cart.find(item => item.productId === productId);

    if (item) {
        item.quantity = parseInt(quantity, 10); 
        req.flash('success', 'Product quantity updated successfully!');
    } else {
        req.flash('error', 'Product not found in the cart.');
    }

    res.redirect('/addtocart/view');  
});

// Remove item from cart
router.post('/remove-from-cart/:productId', (req, res) => {
    const { productId } = req.params;

    req.session.cart = req.session.cart.filter(item => item.productId !== productId);

    req.flash('success', 'Product removed from the cart.');
    res.redirect('/addtocart/view');  
});

// Checkout route
router.get('/checkout', authMiddleware, (req, res) => {
    const cart = req.session.cart || [];
  
    if (cart.length === 0) {
      req.flash('error', 'Your cart is empty. Please add some items before proceeding to checkout.');
      return res.redirect('/addtocart/view');
    }
  
    res.render('checkout', { cart });
  });

module.exports = router;
