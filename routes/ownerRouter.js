const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

if(process.env.NODE_ENV === 'development'){
    router.post('/create' , async (req,res)=>{
    let ownres = await ownerModel.find();
    if(ownres.length > 0){
        return res
        .status(502)
        .send("You Don't have permission to create the owner");
    }

    let{fullname , email , password} = req.body;

    let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
    });
    res.status(201).send(createdOwner);
    });
}

router.get('/admin' , (req,res)=>{
   let success =  req.flash('success');
    res.render('createproducts' ,{success});
});




module.exports = router;