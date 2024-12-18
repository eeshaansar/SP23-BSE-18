// Middleware to check if the user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        req.flash('error_msg', 'You must be logged in to proceed.');
        return res.redirect('/user/login');  
    }
    next(); 
};


module.exports = isAuthenticated;

