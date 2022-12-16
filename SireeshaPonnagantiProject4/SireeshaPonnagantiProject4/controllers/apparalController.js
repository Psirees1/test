const Apparal = require('../models/apparal');
const { DateTime } = require("luxon");

exports.index = (req, res, next) => {
    let categories = [];
    Apparal.distinct("topic", function(error, results){
        categories = results;
        Apparal.find()
        .then(apparals => res.render('./apparal/apparals', {apparals, categories}))
        .catch(err=>next(err));
    });
   
};

exports.new = (req, res) => {
    res.render('./apparal/newApparal');
};

exports.create = (req, res, next) => {
    console.log(req.body)
    let apparal = new Apparal(req.body);//create a new apparal document
    apparal.Owner = req.session.user;
    apparal.save()//insert the document to the database
    .then(apparal=> {
        req.flash('success', 'A new apparal has been created successfully');
        res.redirect('/apparals');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    Apparal.findById(id).populate('Owner', 'firstName lastName')
    .then(apparal=>{
        if(apparal) {
            apparal.date = DateTime.fromSQL(apparal.date).toFormat('LLLL dd, yyyy');
            apparal.startTime = DateTime.fromSQL(apparal.startTime).toFormat('hh:mm a');
            apparal.endTime = DateTime.fromSQL(apparal.endTime).toFormat('hh:mm a');
            return res.render('./apparal/apparalDetail', {apparal});
        } else {
            let err = new Error('No apparal with id identified ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    Apparal.findById(id)
    .then(apparal=>{
        console.log(apparal)
        if(apparal) {

            return res.render('./apparal/apparalDetailEdit', {apparal});
        } else {
            let err = new Error('No apparal with id identified' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let apparal = req.body;
    let id = req.params.id;
    Apparal.findByIdAndUpdate(id, apparal, {useFindAndModify: false, runValidators: true})
    .then(apparal=>{
        if(apparal) {
            req.flash('success', 'apparal has been successfully updated');
            res.redirect('/apparals/'+id);
        } else {
            let err = new Error('No apparal with id identified ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    Apparal.findByIdAndDelete(id, {useFindAndModify: false})
    .then(apparal =>{
        if(apparal) {
            res.redirect('/apparals');
        } else {
            let err = new Error('No apparal with id identified ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};