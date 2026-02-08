const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product_model');

router.post('/create', upload.single('image'), async (req,res)=>{

    try{

        if(!req.file){
            req.flash('error','Image is required');
            return res.redirect('/owner/admin');
        }

        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        // Parse discount: allow "25", "25%", "25.5" -> number
        const discountNum = discount != null && discount !== ''
            ? parseFloat(String(discount).replace(/%/g, ''), 10) || 0
            : 0;
        const priceNum = price != null && price !== ''
            ? parseFloat(String(price).replace(/%/g, ''), 10) || 0
            : 0;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price: priceNum,
            discount: discountNum,
            bgcolor,
            panelcolor,
            textcolor
        });

        req.flash("success","product created successfully");

        res.redirect('/owner/admin');

    } catch(err){

        res.send(err.message);

    }
});

module.exports = router;
