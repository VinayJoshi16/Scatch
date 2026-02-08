const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

// ================== DATABASE ==================
require('./config/mongoose-connection');

// ================== ROUTES ==================
const ownerRouter = require('./routes/ownerRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const index = require('./routes/index');

// ================== CUSTOM MIDDLEWARE ==================
const successMiddleware = require('./middleware/success');

// ================== VIEW ENGINE ==================
app.set('view engine', 'ejs');

// ================== BUILT-IN MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ================== COOKIE PARSER ==================
app.use(cookieParser());

// ================== SESSION ==================
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// ================== FLASH ==================
app.use(flash());

// ================== GLOBAL FLASH HANDLER ==================
app.use(successMiddleware);

// ================== ROUTES ==================
app.use('/', index);
app.use('/owner', ownerRouter);
app.use('/user', usersRouter);
app.use('/users', usersRouter); // support both
app.use('/product', productsRouter);
app.use('/products', productsRouter);  // support both /product and /products

// ================== SERVER ==================
app.listen(3000, () => {
    console.log("Server running on port 3000 🚀");
});
