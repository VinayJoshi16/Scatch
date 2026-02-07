const Joi = require('joi');
const userModel = require('../models/user_models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken')

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

        res.cookie('tokens', token);

        return res.send('user created successfully');

    } catch (err) {
        return res.status(500).send(err.message);
    }
}
