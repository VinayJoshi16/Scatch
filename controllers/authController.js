const Joi = require('joi');
const userModel = require('../models/user_models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');
const success = require('../middleware/success')

module.exports.registerUser = async(req, res) => {

    const userSchema = Joi.object({
        fullname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error, value } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const { fullname, email, password } = value;

        let user = await userModel.findOne({ email });

        if(user){
            return res.status(401).send('you already have an account ..🙏 please login');
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            fullname,
            email,
            password: hash
        });

        let token = generateToken(newUser);

        res.cookie('token', token);

        req.flash('success', 'Account created successfully 🎉');

        return res.redirect('/');

    } catch (err) {
        return res.status(500).send(err.message);
    }
}

module.exports.loginUser = async(req , res) =>{
    let {email , password} = req.body;

    let user = await userModel.findOne({email : email});
    if(!user) return res.status(401).send('Wrong Email & Password');

    bcrypt.compare(password, user.password, (err, result) => {
    if (err) return res.status(500).send('Something went wrong');

    if (result) {
        let token = generateToken(user);
        res.cookie('token', token);
        return res.send('user loggdin ') // IMPORTANT
    }

    return res.status(401).send('Wrong Email & Password');
});

}

module.exports.logout = (req , res)=>{
    res.cookie('token' , "");
    res.redirect('/');
}