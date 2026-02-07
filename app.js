const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path');
const ownerRouter = require('./routes/ownerRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const index = require('./routes/index');

require('dotenv').config();

const db = require('./config/mongoose-connection');

app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use('/', index);
app.use('/owner',ownerRouter);
app.use('/user',usersRouter);
app.use('/product',productsRouter);

app.listen(3000);