//Import Express library to handle HTTP requests to and from server
const express = require('express');
//Import Body Parser library to parse form data from body
const bodyParser = require('body-parser');
//Import cookie-session library
const cookieSession = require('cookie-session');
//Import the router
const authRouter = require('./routes/admin/auth');
//Import the ADMIN products router
const productsRouter = require('./routes/admin/products');
//Import the router for User interface
const userRouter = require('./routes/products');
//Import the router for the shopping cart 
const cartRouter = require('./routes/carts');

const app = express();



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    //Keys is used to encrypt the information inside the cookie 
    keys: ['acdefghijkl']
}));

app.use(authRouter);
app.use(productsRouter);
app.use(userRouter);
app.use(cartRouter);


app.listen(4000, () => {
    console.log('Listening on 4000');
});