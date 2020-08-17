module.exports.ensureAuth = async(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/');
    }
};