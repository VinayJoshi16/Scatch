const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    fullname : String,
    email : String,
    password : String,
    cart : [{
        type : mongoose.Schema.Types.ObjectId,
        ref :'product'
    }],
    order : Array,
    contact : Number,
    picture :String 
});

module.exports =  mongoose.model('user' , userSchema);

