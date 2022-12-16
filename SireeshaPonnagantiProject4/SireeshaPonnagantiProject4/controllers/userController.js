const User = require('../models/user');
const Apparal = require('../models/apparal');

exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new User(req.body);
    user.save()
    .then(user=> {
        req.flash('success', 'You have successfully registered');
        res.redirect('/user/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/user/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/user/new');
        }
        
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Wrong email address');  
            res.redirect('/user/login');
        } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.firstName = user.firstName;
                    req.session.lastName = user.lastName;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/user/profile');
                } else {
                    req.flash('error', 'Wrong password');      
                    res.redirect('/user/login');
                }
            })
            .catch(err => next(err));;     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([User.findById(id), Apparal.find({Owner: id})]) 
    .then(results=>{
        const [user, apparals] = results;
        res.render('./user/profile', {user, apparals})
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
 };



