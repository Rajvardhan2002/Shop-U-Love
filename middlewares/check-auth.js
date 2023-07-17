function checkAuthStatus(req,res,next){
    const uid  = req.session.uid;
    if(!uid){
        return next();
    }
    //Lifetime of res.locals is a single req-res cycle and gets automatically reset for every new cycle. 
    res.locals.uid = uid;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.isAuth = true;
    next();
}

module.exports = checkAuthStatus;