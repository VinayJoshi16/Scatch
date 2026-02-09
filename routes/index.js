const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const productModel = require('../models/product_model');
const userModel = require('../models/user_models');

router.get('/', (req, res) => {
    res.render('index', { loggdin: false });
});

router.get('/shop' , isLoggedIn , async(req , res) =>{
    let products = await productModel.find();
    res.render('shop' ,{ products });
})

router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        // Populate the user's cart with full product documents
        const user = await req.user.populate('cart');

        const items = user.cart || [];

        // Group items by product ID so we get quantity per product
        const itemMap = new Map();

        items.forEach((product) => {
            const id = String(product._id);
            if (!itemMap.has(id)) {
                itemMap.set(id, { product, quantity: 0 });
            }
            itemMap.get(id).quantity += 1;
        });

        const cartItems = Array.from(itemMap.values());

        // Safely calculate cart-wide totals using quantity
        const subtotal = cartItems.reduce((total, { product, quantity }) => {
            const price = Number(product.price) || 0;
            return total + price * quantity;
        }, 0);

        const totalDiscount = cartItems.reduce((total, { product, quantity }) => {
            const discount = Number(product.discount) || 0;
            return total + discount * quantity;
        }, 0);

        const platformFee = cartItems.length ? 20 : 0;
        const bill = subtotal - totalDiscount + platformFee;

        res.render('cart', { cartItems, bill, subtotal, totalDiscount, platformFee });
    } catch (err) {
        console.error('Error loading cart:', err);
        req.flash('error', 'Unable to load cart right now');
        res.redirect('/shop');
    }
});


router.get('/addtocart/:productid' , isLoggedIn , async(req , res) =>{
    try {
        // `isLoggedIn` middleware attaches the logged-in user to `req.user`
        let user = req.user;

        if (!user) {
            req.flash('error', 'You need to login first');
            return res.redirect('/');
        }

        user.cart.push(req.params.productid);
        await user.save();

        req.flash('success' ,' Added to cart');
        res.redirect('/shop');
    } catch (err) {
        console.error('Error adding to cart:', err);
        req.flash('error', 'Something went wrong while adding to cart');
        res.redirect('/shop');
    }
})

router.get('/logout' , isLoggedIn , (req , res) =>{
    res.render('shop');
})

module.exports = router;