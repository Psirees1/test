const Apparal = require('../models/apparal');

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    } else {
        req.flash('error','You are logged in already');
        return res.redirect('/user/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    } else {
        req.flash('error','You need to log in first');
        return res.redirect('/user/login');
    }
};

//check if user is Owner of the apparal
exports.isOwner = (req, res, next)=>{
    let id = req.params.id;
    Apparal.findById(id)
    .then(apparal => {
        console.log(apparal)
        if(!!apparal){
            if(apparal.Owner._id == req.session.user){
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }else{
            let err = new Error('apparal is not found with' +id);
            console.log("no id")
            err.status = 404;
            return next(err);
        } 
    })
    .catch(err=>next(err));
};