const express = require("express");
const router = express.Router();
const Product = require("../../models/products.model");
const Order = require("../../models/orders.model");
const authMiddleware = require("../../middleware/authMiddleware");

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
            existingItem.quantity += 1; // Increase quantity
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
        item.quantity = parseInt(quantity, 10); // Ensure quantity is an integer
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

// Checkout
router.get('/checkout', authMiddleware, (req, res) => {
    const cart = req.session.cart || [];
  
    if (cart.length === 0) {
        req.flash('error', 'Your cart is empty. Please add some items before proceeding to checkout.');
        return res.redirect('/addtocart/view');
    }
  
    res.render('checkoutForm', { cart });
});

// Order placement page
router.get('/place-product', authMiddleware, (req, res) => {
    const successMessage = req.flash('success');
    res.render('placeProduct', { successMessage });
});

router.post('/place-order', authMiddleware, async (req, res) => {
    const { name, email, street, city, postalCode, country } = req.body;
    const cart = req.session.cart || [];

    // Server-side validation
    if (!name || !email || !street || !city || !postalCode || !country) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/addtocart/checkout');
    }

    if (cart.length === 0) {
        req.flash('error', 'Your cart is empty. Please add items to proceed.');
        return res.redirect('/addtocart/view');
    }

    try {
        // Log cart data and customer info
        console.log('Placing order with the following data:');
        console.log('Customer Info:', { name, email, street, city, postalCode, country });
        console.log('Cart Items:', cart);

        // Create order in the database
        const order = new Order({
            customer: { name, email, street, city, postalCode, country },
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            date: new Date(),
        });

        console.log("Order data to be saved:", order);  // Log the order data

        await order.save();  // Save the order

        // Clear the cart after placing the order
        req.session.cart = [];
        req.flash('success', 'Your order has been placed successfully!');
        res.redirect('/addtocart/place-product');
    } catch (error) {
        console.error('Error placing order:', error);
        req.flash('error', 'An error occurred while placing your order. Please try again.');
        res.redirect('/addtocart/checkout');
    }
});


// Route to view order
router.get('/view-order', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId; // Ensure userId is set in session during login
        
        // Fetch the latest order for the logged-in user
        const order = await Order.findOne({ 'customer.userId': userId }).sort({ date: -1 });

        if (!order) {
            req.flash('error', 'No order found. Please place an order first.');
            return res.redirect('/addtocart/view');
        }

        // Render the order details page
        res.render('viewOrder', { order });
    } catch (error) {
        console.error('Error fetching order:', error);
        req.flash('error', 'An error occurred while fetching your order.');
        res.redirect('/addtocart/view');
    }
});

module.exports = router;
