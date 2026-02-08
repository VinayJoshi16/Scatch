const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();
const productModel = require('../models/product_model');

router.get('/', (req, res) => {
    res.render('index');  // success & error come from res.locals via successMiddleware
});

router.get('/shop' , isLoggedIn , async(req , res) =>{
    let products = await productModel.find();
    res.render('shop' ,{products});
})

router.get('/logout' , isLoggedIn , (req , res) =>{
    res.render('shop');
})

module.exports = router;