const express = require('express');
const exphbs = require('express-handlebars');
const methodoverride = require('method-override');
const mongoose = require('mongoose');
const dbconnection= require('./database/connection');
const session = require('express-session');
const ideas = require('./routes/ideas');
const users =require('./routes/users');
const app = express();
const passport = require('passport');
const mongoconnect = require('connect-mongo')(session);


dbconnection();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodoverride('_method')); 
require('./config/passport')(passport);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store:new mongoconnect({mongooseConnection:mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

//global var
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
});

//handlebars middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');


app.get('/',(req,res)=>{
    title='WELCOME';
    res.render('index',{
        title:title
    });
});
app.get('/about',(req,res)=>{
    res.render('about');
});

app.use('/ideas', ideas);
app.use('/users', users);

PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});