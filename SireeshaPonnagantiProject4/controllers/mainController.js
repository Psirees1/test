
exports.index=(req,res) => {
    res.render('index');
}

exports.about=(req,res) => {
    res.render('./apparal/about');
}

exports.contactUs=(req,res) => {
    res.render('./apparal/contactUs');
}