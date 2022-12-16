//require modules

const express = require('express');
const morgan = require('morgan');
const mainRoute = require('./routes/mainRoutes');
const apparalRoute = require('./routes/apparalRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');



//create app
const app = express();

//configure app
let port = 3000;
let Owner = 'localhost';
app.set('view engine', 'ejs');

app.use(
    session({
        secret: "billanapalli",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/demos'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());
app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.firstName = req.session.firstName||null;
    res.locals.lastName = req.session.lastName||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

//connect to database
mongoose.connect('mongodb://localhost:27017/demos')
.then(() => {
    app.listen(port, Owner, () => {
        console.log("Initiated the app -->", Owner,port)
    })
})
.catch(err => console.log(err.message));

//mount the middleware 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// URL
app.use('/', mainRoute);
app.use('/apparals', apparalRoute);
app.use('/user',userRoutes);


//set up routes

app.get('/newapparal', (req, res) => {
console.log("Check");
res.render('./apparal/newapparal');
});

app.use((req, res, next) => {
    let err = new Error('The server cannot locate' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', { error: err });
});



