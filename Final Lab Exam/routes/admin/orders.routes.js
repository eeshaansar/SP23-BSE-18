const express = require('express');
const Order = require('../../models/orders.model'); // Update the path to your Order model if necessary
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// Route to fetch and display orders in the admin panel
router.get('/order', authMiddleware,  async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 }); // Fetch orders sorted by latest date
        res.render('orders/vieworder', { orders }); // Render the vieworder.ejs file with orders data
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
